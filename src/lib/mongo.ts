import { MongoClient } from 'mongodb'
import type { MongoClientOptions } from 'mongodb'

type ClientEntry = {
  client?: MongoClient
  lastUsed: number
  // promise while connecting to avoid duplicate connects
  connecting?: Promise<MongoClient>
}

const MAX_ENTRIES = 50

// Persist the clients map on globalThis so it survives Next.js HMR in dev.
// This prevents creating a new Map on every module reload which would
// otherwise force reconnecting to MongoDB on each request during dev.
declare global {
  // eslint-disable-next-line no-var
  var __mongo_clients__: Map<string, ClientEntry> | undefined
}

// Avoid assignment-in-expression which some linters flag as confusing.
if (!globalThis.__mongo_clients__) {
  globalThis.__mongo_clients__ = new Map()
}
const clients: Map<string, ClientEntry> = globalThis.__mongo_clients__ as Map<string, ClientEntry>

function touch(key: string) {
  const entry = clients.get(key)
  if (!entry) return
  entry.lastUsed = Date.now()
  // move to end to reflect recent use
  clients.delete(key)
  clients.set(key, entry)
}

async function evictIfNeeded() {
  while (clients.size > MAX_ENTRIES) {
    // evict least-recently-used (the first key)
    const iter = clients.keys()
    const next = iter.next()
    if (next.done) break
    const oldestKey = next.value
    const entry = clients.get(oldestKey)
    if (entry) {
      try {
        if (entry.client) await entry.client.close()
      } catch (err) {
        // ignore close errors
        // eslint-disable-next-line no-console
        console.error('Error closing MongoClient during eviction', err)
      }
    }
    clients.delete(oldestKey)
  }
}

export async function getClient(uri: string, options?: MongoClientOptions): Promise<MongoClient> {
  if (!uri) throw new Error('uri required')

  const key = options ? `${uri}::${JSON.stringify(options)}` : uri

  const existing = clients.get(key)
  if (existing) {
    // if already connected or connecting, wait/return
    if (existing.connecting) {
      const client = await existing.connecting
      touch(key)
      return client
    }
    touch(key)
    // eslint-disable-next-line no-console
    console.log(`[mongo] Reusing existing MongoDB client for ${uri}`)
    // existing.client should be present here
    return existing.client as MongoClient
  }

  // create placeholder entry with connecting promise
  const entry: ClientEntry = {
    lastUsed: Date.now(),
  }
  const connecting = (async () => {
    // eslint-disable-next-line no-console
    console.log(`[mongo] Connecting to MongoDB: ${uri}`)
    const client = options ? new MongoClient(uri, options) : new MongoClient(uri)
    await client.connect()
    // eslint-disable-next-line no-console
    console.log(`[mongo] Connected: ${uri}`)
    entry.client = client
    entry.connecting = undefined
    return client
  })()

  entry.connecting = connecting
  clients.set(key, entry)
  // eslint-disable-next-line no-console
  console.log(`[mongo] Created cache entry for ${key} (cache size: ${clients.size})`)
  try {
    const client = await connecting
    // enforce cache size
    await evictIfNeeded()
    return client
  } catch (err) {
    clients.delete(key)
    throw err
  }
}

export async function getDb(uri: string, dbName: string, options?: MongoClientOptions) {
  const client = await getClient(uri, options)
  return client.db(dbName)
}

export async function closeUri(uri: string, options?: MongoClientOptions) {
  const key = options ? `${uri}::${JSON.stringify(options)}` : uri
  const entry = clients.get(key)
  if (!entry) return
  try {
    if (entry.connecting) {
      // wait for connect to finish
      await entry.connecting
    }
    if (entry.client) await entry.client.close()
  } finally {
    clients.delete(key)
  }
}

export async function closeAll() {
  const promises: Promise<void>[] = []
  for (const [key, entry] of clients) {
    const p = (async () => {
      try {
        if (entry.connecting) await entry.connecting
        if (entry.client) await entry.client.close()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error closing MongoClient', err)
      }
    })()
    promises.push(p)
    clients.delete(key)
  }
  await Promise.all(promises)
}

export function getCacheSize() {
  return clients.size
}

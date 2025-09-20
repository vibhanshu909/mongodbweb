import { MongoClient } from 'mongodb'
import type { MongoClientOptions } from 'mongodb'

type ClientEntry = {
  client: MongoClient
  lastUsed: number
  // promise while connecting to avoid duplicate connects
  connecting?: Promise<MongoClient>
}

const MAX_ENTRIES = 50

const clients: Map<string, ClientEntry> = new Map()

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
        await entry.client.close()
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
      touch(uri)
      return client
    }
    touch(key)
    return existing.client
  }

  // create placeholder entry with connecting promise
  const entry: ClientEntry = {
    client: null as unknown as MongoClient,
    lastUsed: Date.now(),
  }
  const connecting = (async () => {
    const client = options ? new MongoClient(uri, options) : new MongoClient(uri)
    await client.connect()
    entry.client = client
    entry.connecting = undefined
    return client
  })()

  entry.connecting = connecting
  clients.set(key, entry)
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
    await entry.client.close()
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
        await entry.client.close()
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

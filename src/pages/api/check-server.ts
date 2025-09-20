import { getClient, closeUri } from '@/lib/mongo'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri } = req.body

  if (!uri) {
    return res.status(400).json({ success: false, error: 'URI is required' })
  }

  // Basic validation: must start with mongodb:// or mongodb+srv://
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    return res
      .status(400)
      .json({ success: false, error: 'Invalid MongoDB URI format' })
  }

  // Apply short timeouts to avoid hanging the request
  const options = {
    // milliseconds
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  }

  try {
    const client = await getClient(uri, options)
    // simple sanity check - list databases
    await client.db().admin().listDatabases()
    return res.status(200).json({ success: true })
  } catch (error: unknown) {
    // Narrow unknown to provide safe messaging
    const errMsg =
      typeof error === 'object' && error !== null && 'message' in error
        ? // @ts-expect-error - readonly access to possible message
          (error as { message?: unknown }).message
        : String(error)
    console.error('Connection error:', errMsg)

    // Map some common error cases to friendlier messages
    let message = 'Failed to connect to server'
    const text = String(errMsg || '')
    if (text.includes('authentication failed')) {
      message = 'Authentication failed: please check credentials'
    } else if (text.includes('ENOTFOUND') || text.includes('getaddrinfo')) {
      message = 'Host not found: please check hostname in the URI'
    } else if (text.includes('timed out') || text.includes('Server selection')) {
      message = 'Connection timed out: server may be unreachable'
    } else if (text) {
      message = text
    }

    return res.status(400).json({ success: false, error: message })
    } finally {
      try {
        // remove the probe client from cache and close it
        await closeUri(uri, options)
      } catch (_e) {
        // ignore close errors
      }
    }
}

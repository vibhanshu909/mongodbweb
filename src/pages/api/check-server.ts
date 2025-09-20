import { MongoClient } from 'mongodb'
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

  const client = new MongoClient(uri)
  try {
    await client.connect()
    await client.db().admin().listDatabases()
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Connection error:', error)
    res.status(400).json({ 
      success: false, 
      error: 'Failed to connect to server' 
    })
  } finally {
    await client.close()
  }
}
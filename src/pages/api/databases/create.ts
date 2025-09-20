import { getDb } from '@/lib/mongo'
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

  const { uri, database } = req.body

  if (!uri || !database) {
    return res.status(400).json({ success: false, error: 'uri and database are required' })
  }

  try {
    // Use shared client manager to get the database
    const db = await getDb(uri, database)
    // Create a collection to ensure database exists (MongoDB creates DB when a collection is created)
    await db.createCollection('__init__')
    // Cleanup helper collection
    await db.collection('__init__').drop()

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Create database error:', error)
    return res.status(500).json({ success: false, error: 'Failed to create database' })
  }
}

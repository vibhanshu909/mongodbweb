import { MongoClient } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

type Database = {
  name: string
  empty: boolean
}

type Data = {
  success: boolean
  data?: Database[]
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
    const dbList = await client.db().admin().listDatabases()
    res.status(200).json({ 
      success: true, 
      data: dbList.databases.map(db => ({
        name: db.name,
        empty: db.empty ?? false
      }))
    })
  } catch (error) {
    console.error('List databases error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list databases' 
    })
  } finally {
    await client.close()
  }
}
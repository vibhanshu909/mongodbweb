import { MongoClient } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

type QueryParams = {
  query?: Record<string, any>
  skip?: number
  limit?: number
  sort?: Record<string, any>
}

type Data = {
  success: boolean
  data?: any[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri, database, collection, params = {} } = req.body
  const { query = {}, skip = 0, limit = 20, sort = {} }: QueryParams = params

  if (!uri || !database || !collection) {
    return res.status(400).json({ 
      success: false, 
      error: 'URI, database, and collection are required' 
    })
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(database)
    const documents = await db
      .collection(collection)
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray()

    res.status(200).json({ 
      success: true, 
      data: documents 
    })
  } catch (error) {
    console.error('Query error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to query collection' 
    })
  } finally {
    await client.close()
  }
}
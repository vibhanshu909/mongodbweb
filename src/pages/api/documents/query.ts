import { getDb } from '@/lib/mongo'
import type { Sort } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { type MongoDocument } from '@/types'

type QueryParams = {
  query?: Record<string, unknown>
  skip?: number
  limit?: number
  sort?: Record<string, unknown>
}

type Data = {
  success: boolean
  data?: MongoDocument[]
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
      error: 'URI, database, and collection are required',
    })
  }

  try {
    const db = await getDb(uri, database)
    const docs = await db
      .collection(collection)
      .find(query)
      .skip(skip)
      .limit(limit)
  // Cast to the driver's Sort type
  .sort(sort as Sort)
      .toArray()

    // Normalize _id to string to match MongoDocument type
    const documents = docs.map((d) => {
      const { _id } = d as { _id?: unknown }
      return { ...d, _id: String(_id) }
    })

    res.status(200).json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error('Query error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to query collection',
    })
  }
}

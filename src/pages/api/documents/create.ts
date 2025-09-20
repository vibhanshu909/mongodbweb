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

  const { uri, database, collection, document } = req.body

  if (!uri || !database || !collection || !document) {
    return res.status(400).json({
      success: false,
      error: 'URI, database, collection, and document are required',
    })
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(database)
    const result = await db.collection(collection).insertOne(document)

    res.status(200).json({
      success: !!result.acknowledged,
    })
  } catch (error) {
    console.error('Create error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create document',
    })
  } finally {
    await client.close()
  }
}

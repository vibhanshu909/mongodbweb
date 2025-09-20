import { MongoClient, ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri, database, collection, id, document } = req.body

  if (!uri || !database || !collection || !id || !document) {
    return res.status(400).json({
      success: false,
      error: 'URI, database, collection, id, and document are required',
    })
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(database)

    // Remove _id from document to avoid conflicts
    const { _id, ...updateDoc } = document

    const result = await db
      .collection(collection)
      .replaceOne({ _id: new ObjectId(id) }, updateDoc, { upsert: true })

    res.status(200).json({
      success: !!result.acknowledged,
    })
  } catch (error) {
    console.error('Update error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update document',
    })
  } finally {
    await client.close()
  }
}

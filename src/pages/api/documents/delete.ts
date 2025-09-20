import { ObjectId } from 'mongodb'
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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri, database, collection, ids } = req.body

  if (!uri || !database || !collection || !ids || !Array.isArray(ids)) {
    return res.status(400).json({
      success: false,
      error: 'URI, database, collection, and ids array are required',
    })
  }

  try {
    const db = await getDb(uri, database)
    const result = await db
      .collection(collection)
      .deleteMany({ _id: { $in: ids.map((id: string) => new ObjectId(id)) } })

    res.status(200).json({ success: !!result.acknowledged })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete documents',
    })
  }
}

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

  const { uri, database, collection } = req.body

  if (!uri || !database || !collection) {
    return res.status(400).json({
      success: false,
      error: 'uri, database, and collection are required',
    })
  }

  try {
    // Get the database
    const db = await getDb(uri, database)

    // Drop the collection
    await db.collection(collection).drop()

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete collection error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete collection'
    return res.status(500).json({ success: false, error: errorMessage })
  }
}

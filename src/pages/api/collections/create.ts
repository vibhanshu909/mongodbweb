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

  const { uri, database, collection } = req.body

  if (!uri || !database || !collection) {
    return res.status(400).json({
      success: false,
      error: 'uri, database, and collection are required',
    })
  }

  // Validate collection name (MongoDB naming rules)
  if (!/^[a-zA-Z0-9_-]+$/.test(collection)) {
    return res.status(400).json({
      success: false,
      error:
        'Collection name can only contain letters, numbers, underscores, and hyphens',
    })
  }

  if (collection.length > 120) {
    return res.status(400).json({
      success: false,
      error: 'Collection name cannot exceed 120 characters',
    })
  }

  try {
    // Get the database
    const db = await getDb(uri, database)

    // Create the collection
    await db.createCollection(collection)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Create collection error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create collection'
    return res.status(500).json({ success: false, error: errorMessage })
  }
}

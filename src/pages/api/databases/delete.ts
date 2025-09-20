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

  const { uri, database } = req.body

  if (!uri || !database) {
    return res.status(400).json({
      success: false,
      error: 'uri and database are required',
    })
  }

  // Validate database name (MongoDB naming rules)
  if (!/^[a-zA-Z0-9_-]+$/.test(database)) {
    return res.status(400).json({
      success: false,
      error:
        'Database name can only contain letters, numbers, underscores, and hyphens',
    })
  }

  try {
    // Get the database
    const db = await getDb(uri, database)

    // Drop the database
    await db.dropDatabase()

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Delete database error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete database'
    return res.status(500).json({ success: false, error: errorMessage })
  }
}

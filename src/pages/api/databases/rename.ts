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
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri, oldDatabase, newDatabase } = req.body

  if (!uri || !oldDatabase || !newDatabase) {
    return res.status(400).json({
      success: false,
      error: 'uri, oldDatabase, and newDatabase are required',
    })
  }

  // Validate database names (MongoDB naming rules)
  const validateName = (name: string) => /^[a-zA-Z0-9_-]+$/.test(name)

  if (!validateName(oldDatabase)) {
    return res.status(400).json({
      success: false,
      error:
        'Old database name can only contain letters, numbers, underscores, and hyphens',
    })
  }

  if (!validateName(newDatabase)) {
    return res.status(400).json({
      success: false,
      error:
        'New database name can only contain letters, numbers, underscores, and hyphens',
    })
  }

  if (oldDatabase === newDatabase) {
    return res.status(400).json({
      success: false,
      error: 'Old and new database names cannot be the same',
    })
  }

  if (newDatabase.length > 64) {
    return res.status(400).json({
      success: false,
      error: 'New database name cannot exceed 64 characters',
    })
  }

  try {
    // Get connections to both databases
    const oldDb = await getDb(uri, oldDatabase)
    const newDb = await getDb(uri, newDatabase)

    // Get all collections from the old database
    const collections = await oldDb.listCollections().toArray()

    // Copy each collection to the new database
    for (const collection of collections) {
      const collectionName = collection.name

      // Get all documents from the old collection
      const documents = await oldDb
        .collection(collectionName)
        .find({})
        .toArray()

      // Insert documents into the new collection (this creates the collection implicitly)
      if (documents.length > 0) {
        await newDb.collection(collectionName).insertMany(documents)
      } else {
        // Create empty collection
        await newDb.createCollection(collectionName)
      }
    }

    // Drop the old database
    await oldDb.dropDatabase()

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Rename database error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to rename database'
    return res.status(500).json({ success: false, error: errorMessage })
  }
}

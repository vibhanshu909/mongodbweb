import { MongoClient } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

type Collection = {
  name: string
  count: number
}

type Data = {
  success: boolean
  data?: Collection[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri, database } = req.body

  if (!uri || !database) {
    return res.status(400).json({ 
      success: false, 
      error: 'URI and database are required' 
    })
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(database)
    const collections = await db.listCollections().toArray()

    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const count = await db.collection(collection.name).countDocuments()
        return {
          name: collection.name,
          count,
        }
      })
    )

    res.status(200).json({ 
      success: true, 
      data: collectionsWithCount 
    })
  } catch (error) {
    console.error('List collections error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list collections' 
    })
  } finally {
    await client.close()
  }
}
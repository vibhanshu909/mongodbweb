import { getClient } from '@/lib/mongo'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  data?: { name: string; empty: boolean }[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { uri } = req.body

  if (!uri) {
    return res.status(400).json({ success: false, error: 'uri is required' })
  }

    const client = await getClient(uri)
  try {
    const dbList = await client.db().admin().listDatabases()
    res.status(200).json({
      success: true,
    data: dbList.databases.map((db: { name: string; empty?: boolean }) => ({ name: db.name, empty: db.empty ?? false })),
    })
  } catch (error) {
    console.error('Refresh databases error:', error)
    res.status(500).json({ success: false, error: 'Failed to refresh databases' })
  } finally {
  }
}

import { NextApiRequest, NextApiResponse } from 'next'
import factory from '../../lib/Factory'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await factory.load()
  const servers = await factory.mongoManager.getServersJson()
  return res.json(servers)
}

import { NextApiRequest, NextApiResponse } from 'next'
import factory from '../../../../../../../../lib/Factory'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await factory.load()
  const server = req.query.server
  const database = req.query.database
  const collection = req.query.collection

  let query = req.query.q
  if (typeof query !== 'object') {
    try {
      query = JSON.parse(query)
    } catch (err) {
      return res.send(new Error(`Invalid query: ${query}`))
    }
  }
  let sort = req.query.sort || '{}'
  if (sort && typeof sort !== 'object') {
    try {
      sort = JSON.parse(sort)
    } catch (err) {
      return res.send(new Error(`Invalid order: ${sort}`))
    }
  }

  let project = req.query.project || ''
  if (project && typeof project !== 'object') {
    try {
      project = JSON.parse(project)
    } catch (err) {
      return res.send(new Error(`Invalid project: ${project}`))
    }
  }

  let limit = parseInt(req.query.limit as string, 10)
  if (isNaN(limit)) {
    limit = 20
  }
  let skip = parseInt(req.query.skip as string, 10)
  if (isNaN(skip)) {
    skip = 0
  }

  const c = await factory.mongoManager.getCollection(
    server as string,
    database as string,
    collection as string,
  )
  if (!c) {
    return res.send(
      new Error(`Collection not found: ${server}.${database}.${collection}`),
    )
  }

  try {
    const results = await c.find(query, project, sort, limit, skip)

    return res.json({
      ok: true,
      results: results,
    })
  } catch (err) {
    return res.send(err)
  }
}

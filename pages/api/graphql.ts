import { ApolloServer } from 'apollo-server-micro'
// import * as allTypes from "./schema"
import GraphQLJSON from 'graphql-type-json'
import { MongoClient, ObjectId } from 'mongodb'
import {
  arg,
  asNexusMethod,
  idArg,
  inputObjectType,
  makeSchema,
  mutationType,
  objectType,
  queryType,
  stringArg,
} from 'nexus'
import * as path from 'path'
import { filterObject } from '../../lib/utils/filterObject'

const json = asNexusMethod(GraphQLJSON, 'json')

const Database = objectType({
  name: 'Database',
  definition(t) {
    t.string('name')
    t.boolean('empty')
  },
})
const Collection = objectType({
  name: 'Collection',
  definition(t) {
    t.string('name')
    t.int('count')
  },
})

export const FindInputType = inputObjectType({
  name: 'FindInputType',
  definition(t) {
    t.json('query', { nullable: true })
    t.int('skip', { default: 0 })
    t.int('limit', { default: 20 })
    t.json('sort', { nullable: true })
  },
})

const Query = queryType({
  definition(t) {
    t.boolean('checkServer', {
      args: { uri: stringArg() },
      resolve: async (_, { uri }) => {
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          return true
        } catch (error) {
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
        return false
      },
    })
    t.list.field('listDatabases', {
      type: Database,
      args: {
        uri: stringArg(),
      },
      resolve: async (_, { uri }) => {
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const dbList = await client.db().admin().listDatabases()
          return dbList.databases
        } catch (error) {
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
      },
      nullable: true,
    })
    t.list.field('listCollections', {
      type: Collection,
      args: {
        uri: stringArg(),
        database: stringArg(),
      },
      resolve: async (_, { uri, database }) => {
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const db = client.db(database)
          let listCollections = await db.listCollections().toArray()

          const listCount = await Promise.all(
            listCollections.map((collection) =>
              db.collection(collection.name).countDocuments(),
            ),
          )
          listCollections = listCollections.map((collection, index) => ({
            name: collection.name,
            count: listCount[index],
          }))
          return listCollections
        } catch (error) {
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
      },
      nullable: true,
    })
    t.json('query', {
      args: {
        uri: stringArg(),
        database: stringArg(),
        collection: stringArg(),
        params: arg({ type: FindInputType, nullable: true }),
      },
      async resolve(_, { uri, database, collection, params }) {
        const { query, ...rest } =
          params ||
          ({
            query: {},
            limit: 20,
            skip: 0,
            sort: {},
          } as any)
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const db = client.db(database)
          return await db
            .collection(collection)
            .find(query, { ...rest, batchSize: rest.limit })
            .toArray()
        } catch (error) {
          throw new Error('Failed to connect')
          // return null
        } finally {
          await client.close()
        }
      },
    })
  },
})

const Mutation = mutationType({
  definition(t) {
    t.json('addServer', {
      args: {
        uri: stringArg(),
      },
      resolve: async (_, { uri }) => {
        const client = new MongoClient(uri)
        try {
          await client.connect()
          await client.db().admin().listDatabases()
          return true
        } catch (error) {
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
      },
    })
    t.boolean('create', {
      args: {
        uri: stringArg(),
        database: stringArg(),
        collection: stringArg(),
        document: arg({ type: 'JSON' }),
      },
      resolve: async (_, args) => {
        const { uri, database, collection, document } = args
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const db = client.db(database)
          const res = await db
            .collection(collection)
            .insertOne(JSON.parse(document))
          return !!res.result.ok
        } catch (error) {
          console.log('error', error)
          throw new Error('Failed to create')
        } finally {
          await client.close()
        }
      },
    })
    t.boolean('update', {
      args: {
        uri: stringArg(),
        database: stringArg(),
        collection: stringArg(),
        id: idArg(),
        document: arg({ type: 'JSON' }),
      },
      resolve: async (_, args) => {
        const { uri, database, collection, id, document } = args
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const db = client.db(database)
          try {
            const res = await db
              .collection(collection)
              // cannot use updateOne as it is equi-valent to Object.assign(old, new)/{...old, ...new}.
              .replaceOne(
                { _id: new ObjectId(id) },
                filterObject(JSON.parse(document), ['_id']),
                {
                  upsert: true,
                },
              )
            return !!res.result.ok
          } catch (error) {
            console.log('error', error)
            throw new Error('Failed to update document')
          }
        } catch (error) {
          console.log('error', error)
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
      },
    })

    t.boolean('delete', {
      args: {
        uri: stringArg(),
        database: stringArg(),
        collection: stringArg(),
        ids: idArg({ list: true }),
      },
      resolve: async (_, args) => {
        const { uri, database, collection, ids } = args
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const db = client.db(database)
          try {
            const res = await db
              .collection(collection)
              .deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
            return !!res.result.ok
          } catch (error) {
            console.log('error', error)
            throw new Error('Failed to delete document')
          }
        } catch (error) {
          console.log('error', error)
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
      },
    })
  },
})

const schema = makeSchema({
  types: [Query, Mutation, json],
  outputs: {
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
    typegen: path.join(process.cwd(), 'generated/generated-types.d.ts'),
  },
  nonNullDefaults: { input: true, output: true },
})

const server = new ApolloServer({
  schema,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default server.createHandler({
  path: '/api/graphql',
})

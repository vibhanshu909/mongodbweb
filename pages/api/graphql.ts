import { ApolloServer } from 'apollo-server-micro'
// import * as allTypes from "./schema"
import GraphQLJSON from 'graphql-type-json'
import { MongoClient } from 'mongodb'
import {
  arg,
  asNexusMethod,
  inputObjectType,
  makeSchema,
  mutationType,
  objectType,
  queryType,
  stringArg,
} from 'nexus'
import * as path from 'path'

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
      args: { uri: stringArg({ nullable: false }) },
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
      nullable: true,
      args: {
        uri: stringArg({ nullable: false }),
      },
      resolve: async (_, { uri }) => {
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        try {
          await client.connect()
          const dbList = await client
            .db()
            .admin()
            .listDatabases()
          return dbList.databases
        } catch (error) {
          throw new Error('Failed to connect')
        } finally {
          await client.close()
        }
      },
    })
    t.list.field('listCollections', {
      type: Collection,
      nullable: true,
      args: {
        uri: stringArg({ nullable: false }),
        database: stringArg({ nullable: false }),
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
            listCollections.map(collection =>
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
    })
    t.json('query', {
      args: {
        uri: stringArg({ nullable: false }),
        database: stringArg({ nullable: false }),
        collection: stringArg({ nullable: false }),
        params: FindInputType,
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
        uri: stringArg({ nullable: false }),
      },
      resolve: async (_, { uri }) => {
        const client = new MongoClient(uri)
        try {
          await client.connect()
          await client
            .db()
            .admin()
            .listDatabases()
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
        uri: stringArg({ nullable: false }),
        database: stringArg({ nullable: false }),
        collection: stringArg({ nullable: false }),
        document: arg({ type: 'JSON', nullable: false }),
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
  },
})

const schema = makeSchema({
  types: [Query, Mutation, json],
  outputs: {
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
    typegen: path.join(process.cwd(), 'generated/generated-types.d.ts'),
  },
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

import { ApolloServer } from 'apollo-server-micro'
// import * as allTypes from "./schema"
import GraphQLJSON from 'graphql-type-json'
import { MongoClient } from 'mongodb'
import {
  asNexusMethod,
  makeSchema,
  mutationType,
  queryType,
  stringArg,
} from 'nexus'
import * as path from 'path'

const json = asNexusMethod(GraphQLJSON, 'json')

const Query = queryType({
  definition(t) {
    t.string('servers', {
      resolve: () => {
        return `Hello World`
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
          client
            .db()
            .admin()
            .listDatabases()
          return true
        } catch (error) {}
        return false
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

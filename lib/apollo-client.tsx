import { ApolloProvider as LibApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import withApollo from 'next-with-apollo'

// Update the GraphQL endpoint to any instance of GraphQL that you like
const GRAPHQL_URL = '/api/graphql'

const link = createHttpLink({
  fetch, // Switches between unfetch & node-fetch for client & server.
  uri: GRAPHQL_URL,
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export const ApolloProvider: React.FC = ({ children }) => (
  <LibApolloProvider client={client}>{children}</LibApolloProvider>
)

// Export a HOC from next-with-apollo
// Docs: https://www.npmjs.com/package/next-with-apollo
export const withData = withApollo(
  // You can get headers and ctx (context) from the callback params
  // e.g. ({ headers, ctx, initialState })
  ({ initialState }) =>
    new ApolloClient({
      link,
      cache: new InMemoryCache()
        //  rehydrate the cache using the initial data passed from the server:
        .restore(initialState || {}),
    }),
)

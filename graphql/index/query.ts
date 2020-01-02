import gql from 'graphql-tag'

export const CheckServerQuery = gql`
  query CheckServerQuery($uri: String!) {
    checkServer(uri: $uri)
  }
`

export const ListDatabasesQuery = gql`
  query ListDatabasesQuery($uri: String!) {
    listDatabases(uri: $uri) {
      name
      empty
    }
  }
`

export const ListCollectionsQuery = gql`
  query ListCollectionsQuery($uri: String!, $database: String!) {
    listCollections(uri: $uri, database: $database) {
      name
      count
    }
  }
`

export const QueryQuery = gql`
  query QueryQuery(
    $uri: String!
    $database: String!
    $collection: String!
    $params: FindInputType
  ) {
    query(
      uri: $uri
      database: $database
      collection: $collection
      params: $params
    )
  }
`

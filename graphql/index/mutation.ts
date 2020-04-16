import gql from 'graphql-tag'

export const Create = gql`
  mutation Create(
    $uri: String!
    $database: String!
    $collection: String!
    $document: JSON!
  ) {
    create(
      uri: $uri
      database: $database
      collection: $collection
      document: $document
    )
  }
`

export const Update = gql`
  mutation Update(
    $uri: String!
    $database: String!
    $collection: String!
    $id: ID!
    $document: JSON!
  ) {
    update(
      uri: $uri
      database: $database
      collection: $collection
      id: $id
      document: $document
    )
  }
`
export const Delete = gql`
  mutation Delete(
    $uri: String!
    $database: String!
    $collection: String!
    $ids: [ID!]!
  ) {
    delete(uri: $uri, database: $database, collection: $collection, ids: $ids)
  }
`

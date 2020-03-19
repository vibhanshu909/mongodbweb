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
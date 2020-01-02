import gql from 'graphql-tag'

export const CheckServerQuery = gql`
  query CheckServerQuery($uri: String!) {
    checkServer(uri: $uri)
  }
`

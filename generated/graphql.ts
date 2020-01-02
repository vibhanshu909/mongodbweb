import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
}

export interface ICollection {
  __typename?: 'Collection'
  name: Scalars['String']
  count: Scalars['Int']
}

export interface IDatabase {
  __typename?: 'Database'
  name: Scalars['String']
  empty: Scalars['Boolean']
}

export interface IFindInputType {
  query?: Maybe<Scalars['JSON']>
  skip?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  sort?: Maybe<Scalars['JSON']>
}

export interface IMutation {
  __typename?: 'Mutation'
  addServer: Scalars['JSON']
}

export interface IMutationAddServerArgs {
  uri: Scalars['String']
}

export interface IQuery {
  __typename?: 'Query'
  servers: Scalars['String']
  checkServer: Scalars['Boolean']
  listDatabases?: Maybe<IDatabase[]>
  listCollections?: Maybe<ICollection[]>
  query: Scalars['JSON']
}

export interface IQueryCheckServerArgs {
  uri: Scalars['String']
}

export interface IQueryListDatabasesArgs {
  uri: Scalars['String']
}

export interface IQueryListCollectionsArgs {
  uri: Scalars['String']
  database: Scalars['String']
}

export interface IQueryQueryArgs {
  uri: Scalars['String']
  database: Scalars['String']
  collection: Scalars['String']
  params?: Maybe<IFindInputType>
}

export interface ICheckServerQueryQueryVariables {
  uri: Scalars['String']
}

export type ICheckServerQueryQuery = { __typename?: 'Query' } & Pick<
  IQuery,
  'checkServer'
>

export interface IListDatabasesQueryQueryVariables {
  uri: Scalars['String']
}

export type IListDatabasesQueryQuery = { __typename?: 'Query' } & {
  listDatabases: Maybe<
    Array<{ __typename?: 'Database' } & Pick<IDatabase, 'name' | 'empty'>>
  >
}

export interface IListCollectionsQueryQueryVariables {
  uri: Scalars['String']
  database: Scalars['String']
}

export type IListCollectionsQueryQuery = { __typename?: 'Query' } & {
  listCollections: Maybe<
    Array<{ __typename?: 'Collection' } & Pick<ICollection, 'name' | 'count'>>
  >
}

export interface IQueryQueryQueryVariables {
  uri: Scalars['String']
  database: Scalars['String']
  collection: Scalars['String']
  params?: Maybe<IFindInputType>
}

export type IQueryQueryQuery = { __typename?: 'Query' } & Pick<IQuery, 'query'>

export const CheckServerQueryDocument = gql`
  query CheckServerQuery($uri: String!) {
    checkServer(uri: $uri)
  }
`

/**
 * __useCheckServerQueryQuery__
 *
 * To run a query within a React component, call `useCheckServerQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckServerQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckServerQueryQuery({
 *   variables: {
 *      uri: // value for 'uri'
 *   },
 * });
 */
export function useCheckServerQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ICheckServerQueryQuery,
    ICheckServerQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ICheckServerQueryQuery,
    ICheckServerQueryQueryVariables
  >(CheckServerQueryDocument, baseOptions)
}
export function useCheckServerQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ICheckServerQueryQuery,
    ICheckServerQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ICheckServerQueryQuery,
    ICheckServerQueryQueryVariables
  >(CheckServerQueryDocument, baseOptions)
}
export type CheckServerQueryQueryHookResult = ReturnType<
  typeof useCheckServerQueryQuery
>
export type CheckServerQueryLazyQueryHookResult = ReturnType<
  typeof useCheckServerQueryLazyQuery
>
export type CheckServerQueryQueryResult = ApolloReactCommon.QueryResult<
  ICheckServerQueryQuery,
  ICheckServerQueryQueryVariables
>
export const ListDatabasesQueryDocument = gql`
  query ListDatabasesQuery($uri: String!) {
    listDatabases(uri: $uri) {
      name
      empty
    }
  }
`

/**
 * __useListDatabasesQueryQuery__
 *
 * To run a query within a React component, call `useListDatabasesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListDatabasesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListDatabasesQueryQuery({
 *   variables: {
 *      uri: // value for 'uri'
 *   },
 * });
 */
export function useListDatabasesQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IListDatabasesQueryQuery,
    IListDatabasesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IListDatabasesQueryQuery,
    IListDatabasesQueryQueryVariables
  >(ListDatabasesQueryDocument, baseOptions)
}
export function useListDatabasesQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IListDatabasesQueryQuery,
    IListDatabasesQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IListDatabasesQueryQuery,
    IListDatabasesQueryQueryVariables
  >(ListDatabasesQueryDocument, baseOptions)
}
export type ListDatabasesQueryQueryHookResult = ReturnType<
  typeof useListDatabasesQueryQuery
>
export type ListDatabasesQueryLazyQueryHookResult = ReturnType<
  typeof useListDatabasesQueryLazyQuery
>
export type ListDatabasesQueryQueryResult = ApolloReactCommon.QueryResult<
  IListDatabasesQueryQuery,
  IListDatabasesQueryQueryVariables
>
export const ListCollectionsQueryDocument = gql`
  query ListCollectionsQuery($uri: String!, $database: String!) {
    listCollections(uri: $uri, database: $database) {
      name
      count
    }
  }
`

/**
 * __useListCollectionsQueryQuery__
 *
 * To run a query within a React component, call `useListCollectionsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useListCollectionsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListCollectionsQueryQuery({
 *   variables: {
 *      uri: // value for 'uri'
 *      database: // value for 'database'
 *   },
 * });
 */
export function useListCollectionsQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IListCollectionsQueryQuery,
    IListCollectionsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    IListCollectionsQueryQuery,
    IListCollectionsQueryQueryVariables
  >(ListCollectionsQueryDocument, baseOptions)
}
export function useListCollectionsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IListCollectionsQueryQuery,
    IListCollectionsQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IListCollectionsQueryQuery,
    IListCollectionsQueryQueryVariables
  >(ListCollectionsQueryDocument, baseOptions)
}
export type ListCollectionsQueryQueryHookResult = ReturnType<
  typeof useListCollectionsQueryQuery
>
export type ListCollectionsQueryLazyQueryHookResult = ReturnType<
  typeof useListCollectionsQueryLazyQuery
>
export type ListCollectionsQueryQueryResult = ApolloReactCommon.QueryResult<
  IListCollectionsQueryQuery,
  IListCollectionsQueryQueryVariables
>
export const QueryQueryDocument = gql`
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

/**
 * __useQueryQueryQuery__
 *
 * To run a query within a React component, call `useQueryQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryQueryQuery({
 *   variables: {
 *      uri: // value for 'uri'
 *      database: // value for 'database'
 *      collection: // value for 'collection'
 *      params: // value for 'params'
 *   },
 * });
 */
export function useQueryQueryQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    IQueryQueryQuery,
    IQueryQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<IQueryQueryQuery, IQueryQueryQueryVariables>(
    QueryQueryDocument,
    baseOptions,
  )
}
export function useQueryQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    IQueryQueryQuery,
    IQueryQueryQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    IQueryQueryQuery,
    IQueryQueryQueryVariables
  >(QueryQueryDocument, baseOptions)
}
export type QueryQueryQueryHookResult = ReturnType<typeof useQueryQueryQuery>
export type QueryQueryLazyQueryHookResult = ReturnType<
  typeof useQueryQueryLazyQuery
>
export type QueryQueryQueryResult = ApolloReactCommon.QueryResult<
  IQueryQueryQuery,
  IQueryQueryQueryVariables
>

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
}


export enum ICacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export interface IQuery {
   __typename?: 'Query',
  sayHello?: Maybe<Scalars['String']>,
}


export type ISayHelloQueryVariables = {};


export type ISayHelloQuery = (
  { __typename?: 'Query' }
  & Pick<IQuery, 'sayHello'>
);


export const SayHelloDocument = gql`
    query SayHello {
  sayHello
}
    `;

/**
 * __useSayHelloQuery__
 *
 * To run a query within a React component, call `useSayHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useSayHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSayHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useSayHelloQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ISayHelloQuery, ISayHelloQueryVariables>) {
        return ApolloReactHooks.useQuery<ISayHelloQuery, ISayHelloQueryVariables>(SayHelloDocument, baseOptions);
      }
export function useSayHelloLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ISayHelloQuery, ISayHelloQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ISayHelloQuery, ISayHelloQueryVariables>(SayHelloDocument, baseOptions);
        }
export type SayHelloQueryHookResult = ReturnType<typeof useSayHelloQuery>;
export type SayHelloLazyQueryHookResult = ReturnType<typeof useSayHelloLazyQuery>;
export type SayHelloQueryResult = ApolloReactCommon.QueryResult<ISayHelloQuery, ISayHelloQueryVariables>;
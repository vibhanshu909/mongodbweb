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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
}


export interface IMutation {
   __typename?: 'Mutation',
  addServer: Scalars['JSON'],
}


export interface IMutationAddServerArgs {
  uri: Scalars['String']
}

export interface IQuery {
   __typename?: 'Query',
  servers: Scalars['String'],
  checkServer: Scalars['Boolean'],
}


export interface IQueryCheckServerArgs {
  uri: Scalars['String']
}

export type ICheckServerQueryQueryVariables = {
  uri: Scalars['String']
};


export type ICheckServerQueryQuery = (
  { __typename?: 'Query' }
  & Pick<IQuery, 'checkServer'>
);


export const CheckServerQueryDocument = gql`
    query CheckServerQuery($uri: String!) {
  checkServer(uri: $uri)
}
    `;

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
export function useCheckServerQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICheckServerQueryQuery, ICheckServerQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ICheckServerQueryQuery, ICheckServerQueryQueryVariables>(CheckServerQueryDocument, baseOptions);
      }
export function useCheckServerQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICheckServerQueryQuery, ICheckServerQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICheckServerQueryQuery, ICheckServerQueryQueryVariables>(CheckServerQueryDocument, baseOptions);
        }
export type CheckServerQueryQueryHookResult = ReturnType<typeof useCheckServerQueryQuery>;
export type CheckServerQueryLazyQueryHookResult = ReturnType<typeof useCheckServerQueryLazyQuery>;
export type CheckServerQueryQueryResult = ApolloReactCommon.QueryResult<ICheckServerQueryQuery, ICheckServerQueryQueryVariables>;
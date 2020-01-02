import React, { useContext, useEffect } from 'react'
import { FaArrowCircleRight } from 'react-icons/fa'
import { useQueryQueryLazyQuery } from '../generated/graphql'
import { CollectionContext } from '../pages/_app'
import CircularLoader from './CircularLoader'
import { Row } from './Row'
export const CollectionButton: React.FC<{
  server: string
  database: string
  collection: string
  params?: any
  count: number
}> = props => {
  const { server, database, collection, params, count } = props
  const { setPayload } = useContext(CollectionContext)
  const [query, { loading, data, error }] = useQueryQueryLazyQuery({
    variables: {
      uri: server,
      database,
      collection,
      params,
    },
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (data && data.query) {
      setPayload(prev => ({ ...prev, collectionData: data.query }))
    }
  }, [data])
  if (error) {
    return <p className='text-red-400'>{error.graphQLErrors[0].message}</p>
  }
  const fireQuery = () => query()
  return (
    <button
      disabled={loading}
      className='text-white w-full px-2 focus:bg-gray-600 focus:outline-none'
      onDoubleClick={fireQuery}
    >
      <Row>
        <span>{collection}</span>
        {loading ? (
          <CircularLoader />
        ) : (
          <>
            <span>{count}</span>
            <button onClick={fireQuery} className='ml-2 my-auto'>
              <FaArrowCircleRight />
            </button>
          </>
        )}
      </Row>
    </button>
  )
}

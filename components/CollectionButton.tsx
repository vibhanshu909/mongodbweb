import React, { useContext, useEffect } from 'react'
import { useQueryQueryLazyQuery } from '../generated/graphql'
import { CollectionContext } from '../pages/_app'
import CircularLoader from './CircularLoader'
import EnhancedMenu, { MenuItem } from './EnhancedMenu'

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
    <div>
      <button
        disabled={loading}
        className='select-none w-full px-2 focus:bg-blue-600 focus:outline-none'
        onDoubleClick={fireQuery}
      >
        <div className='flex flex-no-wrap justify-between items-baseline'>
          <div className='mx-2'>
            <span>{collection}</span>
          </div>
          <div className='mx-2'>
            {loading ? (
              <CircularLoader />
            ) : (
              <div className='flex flex-no-wrap items-baseline'>
                <div className='mx-1'>
                  <span>{count}</span>
                </div>
                <div className='mx-1'>
                  <EnhancedMenu>
                    <MenuItem onClick={fireQuery}>View data</MenuItem>
                    <MenuItem>Delete</MenuItem>
                  </EnhancedMenu>
                </div>
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  )
}

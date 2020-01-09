import React, { useEffect } from 'react'
import { useListCollectionsQueryLazyQuery } from '../generated/graphql'
import CircularLoader from './CircularLoader'
import { CollectionButton } from './CollectionButton'

const ListCollections: React.FC<{
  server: string
  database: string
}> = props => {
  const { server, database } = props
  const [
    listCollection,
    { data, loading, error },
  ] = useListCollectionsQueryLazyQuery({
    variables: {
      uri: server,
      database,
    },
  })
  useEffect(() => {
    listCollection()
  }, [])
  if (loading) {
    return <CircularLoader />
  }
  return (
    <>
      {data?.listCollections?.map((collection, key) => {
        return (
          <CollectionButton
            {...props}
            key={key}
            collection={collection.name}
            count={collection.count}
          />
        )
      }) || <p>No Collections Found!</p>}
    </>
  )
}

export default ListCollections

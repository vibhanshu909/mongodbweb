import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useListDatabasesQueryLazyQuery } from '../generated/graphql'
import CircularLoader from './CircularLoader'
import Collapse from './Collapse'

const ListCollections = dynamic(() => import('./ListCollections'))

const ListDatabases: React.FC<{ server: string; onDelete?: () => void }> = ({
  server,
  onDelete,
}) => {
  const [
    listDatabases,
    { data, loading, error },
  ] = useListDatabasesQueryLazyQuery({
    variables: {
      uri: server,
    },
  })
  useEffect(() => {
    listDatabases()
  }, [])
  if (loading) {
    return <CircularLoader />
  } else if (error) {
    return <p className='text-red-400'>{error.graphQLErrors[0].message}</p>
  }
  const url = new URL(server).pathname.split('@')[1] || server
  return (
    <Collapse title={url}>
      {data?.listDatabases?.map((database, key) => {
        if (database.empty) {
          return <p key={key}>{database.name}</p>
        }
        return (
          <Collapse key={key} title={database.name}>
            <ListCollections server={server} database={database.name} />
          </Collapse>
        )
      }) || <p>No Databases Found!</p>}
    </Collapse>
  )
}

export default ListDatabases

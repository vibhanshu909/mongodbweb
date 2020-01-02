import React, { useEffect } from 'react'
import { useListDatabasesQueryLazyQuery } from '../generated/graphql'
import CircularLoader from './CircularLoader'
import Collapse from './Collapse'
import ListCollections from './ListCollections'

const ListDatabases: React.FC<{ server: string }> = ({ server }) => {
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
    return <p className="text-red-400">{error.graphQLErrors[0].message}</p>
  }
  const url = new URL(server).pathname.split('@')[1]
  return (
    <Collapse title={url}>
      {data?.listDatabases?.map((database, key) => {
        if (database.empty) {
          return <p key={key}>{database.name}</p>
        }
        return (
          <Collapse key={key} title={database.name}>
            <ListCollections
              key={key}
              server={server}
              database={database.name}
            />
          </Collapse>
        )
      })}
    </Collapse>
  )
}

export default ListDatabases

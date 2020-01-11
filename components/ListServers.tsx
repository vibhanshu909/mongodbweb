import React, { useContext } from 'react'
import ListDatabases from './ListDatabases'
import { LocalStorageContext } from './LocalStorageContext/LocalStorageContext'
import { RemoveButton } from './RemoveButton'

export const ListServers = () => {
  const { payload, setPayload } = useContext(LocalStorageContext)
  return (
    <>
      {payload?.servers?.map((server: string) => {
        return (
          <div
            key={server}
            className='flex flex-no-wrap justify-between items-baseline'
          >
            <div className='mx-1'>
              <ListDatabases server={server} />
            </div>
            <div className='mx-1'>
              <RemoveButton
                title={'Remove Server'}
                onClick={() => {
                  setPayload((prev: any) => {
                    const newPayload = {
                      ...prev,
                      servers: prev.servers.filter((s: string) => s !== server),
                    }
                    return newPayload
                  })
                }}
              />
            </div>
          </div>
        )
      }) || <p>No Servers Found!</p>}
    </>
  )
}

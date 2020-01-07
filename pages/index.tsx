import { NextPage } from 'next'
import React, { useContext } from 'react'
import NoSSR from 'react-no-ssr'
import { AddServerForm } from '../components/AddServerForm'
import { Collection } from '../components/Collection'
import { DeleteButton } from '../components/DeleteButton'
import ListDatabases from '../components/ListDatabases'
import { LocalStorageContext } from '../components/LocalStorageContext/LocalStorageContext'

const Index: NextPage = () => {
  const { payload, setPayload } = useContext(LocalStorageContext)
  return (
    <div className='bg-gray-900'>
      <div className='my-3'>
        <NoSSR>
          <AddServerForm />
        </NoSSR>
      </div>
      <div className='flex flex-no-wrap'>
        <div className='self-start mx-2 bg-gray-800 p-4 sticky top-0 max-w-sm'>
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
                  <DeleteButton
                    title={'Delete'}
                    onClick={() => {
                      setPayload((prev: any) => {
                        const newPayload = {
                          ...prev,
                          servers: prev.servers.filter(
                            (s: string) => s !== server,
                          ),
                        }
                        return newPayload
                      })
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className='flex-auto mx-2 bg-gray-800 min-h-full p-4'>
          <Collection />
        </div>
      </div>
    </div>
  )
}

export default Index

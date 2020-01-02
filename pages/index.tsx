import { NextPage } from 'next'
import React, { useContext } from 'react'
import NoSSR from 'react-no-ssr'
import { AddServerForm } from '../components/AddServerForm'
import { Collection } from '../components/Collection'
import ListDatabases from '../components/ListDatabases'
import { LocalStorageContext } from '../components/LocalStorageContext/LocalStorageContext'

const Index: NextPage = () => {
  const { payload } = useContext(LocalStorageContext)
  return (
    <div>
      <div className="my-3">
        <NoSSR>
          <AddServerForm />
        </NoSSR>
      </div>
      <div className="flex flex-wrap md:flex-no-wrap">
        <div className="self-start mx-2 bg-gray-800 p-4 sticky top-0 max-w-sm">
          {payload?.servers?.map((server: string) => {
            return <ListDatabases server={server} key={server} />
          })}
        </div>
        <div className="flex-auto mx-2 bg-gray-800 min-h-full p-4">
          <Collection />
        </div>
      </div>
    </div>
  )
}

export default Index

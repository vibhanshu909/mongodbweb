import React from 'react'
import { AddServerForm } from '../components/AddServerForm'
import { Collection } from '../components/Collection'
import { ListServers } from '../components/ListServers'

const Test = () => {
  return (
    <div className='flex flex-wrap md:flex-no-wrap h-screen z-0'>
      <div className='h-full min-w-1/3 border-r-2 border-gray-200 hidden md:block overflow-y-auto'>
        <AddServerForm />
        <ListServers />
      </div>
      <div className='flex-grow h-full md:overflow-auto mt-16 md:mt-0'>
        <Collection />
      </div>
    </div>
  )
}

export default Test

import React from 'react'
import { AddServerForm } from '../components/AddServerForm'
import { Collection } from '../components/Collection'
import ListServers from '../components/ListServers'

const Test = () => {
  return (
    <div className='flex flex-wrap md:flex-no-wrap h-screen z-0'>
      <div className='h-full min-w-1/3 border-r-2 border-gray-200 hidden md:block overflow-y-auto text-black'>
        <AddServerForm />
        <ListServers />
        {/* <div className='flex flex-col'>
          <div className='text-black'>
          </div>
          <div>
          </div>
        </div> */}
      </div>
      <div className='h-full right-0 overflow-auto'>
        <Collection />
      </div>
    </div>
  )
}

export default Test

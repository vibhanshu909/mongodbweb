import React, { useState } from 'react'
import { FaBars, FaDonate } from 'react-icons/fa'
import { AddServerForm } from '../components/AddServerForm'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { IconButton } from '../components/IconButton'
import { ListServers } from '../components/ListServers'
import Logo from '../public/images/logo.png'

export const Sidebar = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <FaBars />
      </IconButton>
      {open && (
        <Dialog position='left' onClose={() => setOpen(false)}>
          {/* <div className='h-full min-w-1/3 border-r-2 border-gray-200 hidden md:block overflow-y-auto'> */}
          {/* <div className='h-full overflow-auto'> */}
          <div className='h-full flex flex-col justify-between'>
            <div>
              <AddServerForm />
              <ListServers />
            </div>
            <div className='border-t-2 border-gray-200'>
              <Button color='success' className='mt-5 w-full'>
                <FaDonate className='inline mr-2 focus:outline-none' /> Donate
                Us
              </Button>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}
        </Dialog>
      )}
    </>
  )
}

const Header = () => {
  return (
    <header className='fixed w-full md:sticky top-0 z-10'>
      <div className='bg-white px-5 py-1 shadow-4xl border-b-2 border-gray-200'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='flex flex-no-wrap items-center'>
              <div className='block mr-3 md:mr-0 md:hidden'>
                <Sidebar />
              </div>
              <div className='mr-2'>
                <img src={Logo} alt='logo' className='h-12' />
              </div>
              <div>
                <h1 className='text-xl'>MongoDB Web</h1>
                <p className='text-sm text-gray-500'>
                  A simple web based mongodb studio
                </p>
              </div>
            </div>
          </div>
          <div className='hidden md:block'>
            <Button color='success'>
              <FaDonate className='inline mr-2 focus:outline-none' /> Donate Us
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

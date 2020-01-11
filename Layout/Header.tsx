import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { AddServerForm } from '../components/AddServerForm'
import { Dialog } from '../components/Dialog'
import { DonateUs } from '../components/DonateUs'
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
          <div className='h-full flex flex-col justify-between'>
            <div>
              <AddServerForm />
              <ListServers />
            </div>
            <div className='border-t-2 border-gray-200'>
              <DonateUs />
            </div>
          </div>
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
                <h1 className='text-xl'>
                  MongoDB Web <sup className='text-sm text-red-500'>[beta]</sup>
                </h1>
                <p className='text-sm text-gray-500'>
                  A simple web based mongodb studio
                </p>
              </div>
            </div>
          </div>
          <div className='hidden md:block'>
            <DonateUs />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

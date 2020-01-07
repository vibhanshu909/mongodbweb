import React from 'react'
import { FaDonate } from 'react-icons/fa'
import { Button } from '../components/Button'
import Logo from '../public/images/logo.png'

const Header = () => {
  return (
    <header className='sticky top-0 z-10'>
      <div className='bg-white text-gray-700 px-5 py-1 shadow-4xl border-b-2 border-gray-200'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='flex flex-no-wrap items-center'>
              <div className='mr-2'>
                <img src={Logo} alt='logo' className='h-12' />
              </div>
              <div>
                <h1 className='text-xl text-black'>MongoDB Web</h1>
                <p className='text-sm'>A simple web based mongodb studio</p>
              </div>
            </div>
          </div>
          <div>
            <Button color='success' className='text-white'>
              <FaDonate className='inline mr-2 focus:outline-none' /> Donate Us
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

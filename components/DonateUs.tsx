import React from 'react'
import { FaDonate } from 'react-icons/fa'
import { Button } from './Button'

export const DonateUs = () => {
  return (
    <a href='https://rzp.io/l/mongodbweb' target='_blank'>
      <Button color='success' className='mt-5 w-full'>
        <FaDonate className='inline mr-2 focus:outline-none' /> Donate Us
      </Button>
    </a>
  )
}

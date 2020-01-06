import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { Button } from './Button'
import { IconButton } from './IconButton'

export const DeleteButton: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = props => {
  const [open, setOpen] = useState(false)
  const { onClick } = props
  const handleDelete: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void = e => {
    e.preventDefault()
    e.stopPropagation()
    onClick?.(e)
    setOpen(false)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <>
      <IconButton
        className='rounded-full p-3 text-red-600 focus:outline-none'
        {...props}
        onClick={handleOpen}
      >
        <FaTrash />
      </IconButton>
      {open && (
        <div className='w-screen h-screen fixed inset-0' onClick={handleClose}>
          <div className='flex h-full dialog-container'>
            <div className='bg-white p-3 md:w-1/3 text-black m-auto rounded'>
              <div>
                <h1 className='text-gray-900 text-2xl'>Are you sure?</h1>
              </div>
              <p className='my-5 '>This action can't be undone.</p>
              <div className='flex justify-between items-center'>
                <div className='mr-2'>
                  <Button onClick={handleClose} className='text-white'>
                    No
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={handleDelete}
                    className='text-white'
                    color='danger'
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx={true}>{`
        .dialog-container {
          background-color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  )
}

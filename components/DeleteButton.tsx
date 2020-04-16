import React, { useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { ConfirmDialog } from './ConfirmDialog'
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
        <FaTrashAlt className='text-red-600' />
      </IconButton>
      {open && (
        <ConfirmDialog
          onClose={handleClose}
          onPositive={handleDelete}
          title='Are you sure?'
        >
          This action can't be undone.
        </ConfirmDialog>
      )}
    </>
  )
}

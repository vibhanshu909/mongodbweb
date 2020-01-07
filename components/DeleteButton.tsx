import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import Dialog from './Dialog'
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
        <Dialog
          onClose={handleClose}
          onPositive={handleDelete}
          title='Are you sure?'
        >
          This action can't be undone.
        </Dialog>
      )}
    </>
  )
}

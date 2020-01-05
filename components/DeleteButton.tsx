import React from 'react'
import { FaTrash } from 'react-icons/fa'

export const DeleteButton: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = props => {
  return (
    <>
      <button className='rounded-full p-3 text-red-600' {...props}>
        <FaTrash />
      </button>
      <style jsx={true}>{`
        button:hover {
          background-color: rgba(155, 0, 0, 0.2);
        }
      `}</style>
    </>
  )
}

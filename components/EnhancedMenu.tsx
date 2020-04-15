import React, { useState } from 'react'
import { FaEllipsisV } from 'react-icons/fa'
import { useClickOutsideListenerRef } from '../hooks/useClickoutsideListenerRef'
import { IconButton } from './IconButton'

const Content: React.FC<{ onClose: () => void }> = ({ onClose, children }) => {
  const ref = useClickOutsideListenerRef(onClose)
  return (
    <div
      ref={ref}
      className={`absolute bg-white text-gray-900 py-2 rounded border-2 shadow-xl z-10 w-32`}
    >
      {children}
    </div>
  )
}

export const MenuItem: React.FC<{ onClick?: any; className?: string }> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <div
      className={`p-3 hover:bg-blue-200 cursor:pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const EnhancedMenu: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className='relative'>
      <IconButton
        className='rounded-full p-3 focus:outline-none'
        onClick={() => {
          setOpen(true)
        }}
      >
        <FaEllipsisV />
      </IconButton>
      {open && <Content onClose={() => setOpen(false)}>{children}</Content>}
    </div>
  )
}

export default EnhancedMenu

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaEllipsisV } from 'react-icons/fa'
import { IconButton } from './IconButton'

export const Content: React.FC<{ onClose: any }> = ({ onClose, children }) => {
  const ref = useRef(null)
  const escapeListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [])
  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (!(ref.current! as any).contains(e.target)) {
        onClose?.()
      }
    },
    [ref.current],
  )
  useEffect(() => {
    document.addEventListener('click', clickListener)
    document.addEventListener('keyup', escapeListener)
    return () => {
      document.removeEventListener('click', clickListener)
      document.removeEventListener('keyup', escapeListener)
    }
  }, [onClose])
  return (
    <div
      ref={ref}
      className='absolute inset-auto bg-white text-gray-900 py-2 rounded'
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
    <>
      <IconButton
        className='rounded-full p-3 focus:outline-none'
        onClick={() => {
          setOpen(true)
        }}
      >
        <FaEllipsisV />
      </IconButton>
      {open && (
        <Content
          onClose={() => {
            setOpen(false)
          }}
        >
          {children}
        </Content>
      )}
    </>
  )
}

export default EnhancedMenu

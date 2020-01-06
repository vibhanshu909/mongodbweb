import React from 'react'

export const IconButton: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = props => {
  const { children, className } = props
  return (
    <>
      <button
        className={`rounded-full p-3 focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </button>
      <style jsx={true}>{`
        button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  )
}

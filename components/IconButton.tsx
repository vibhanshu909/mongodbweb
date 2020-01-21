import React from 'react'

export const IconButton: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = props => {
  const { children, className, ...rest } = props
  return (
    <>
      <button
        className={`rounded-full p-3 focus:outline-none ${className}`}
        {...rest}
      >
        {children}
      </button>
      <style jsx={true}>{`
        button[disabled] {
          cursor: not-allowed;
          opacity: 0.5;
        }
        button[disabled]:hover {
          background-color: rgba(150, 150, 150, 0);
        }
        button:hover {
          background-color: rgba(150, 150, 150, 0.2);
        }
      `}</style>
    </>
  )
}

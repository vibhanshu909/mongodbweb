import React from 'react'
export const Row: React.FC = ({ children }) => {
  return (
    <div className='flex justify-between'>
      {children instanceof Array ? (
        children.map((child, key) => (
          <div key={key} className='m-2'>
            {child}
          </div>
        ))
      ) : (
        <div className='m-2'>{children}</div>
      )}
    </div>
  )
}

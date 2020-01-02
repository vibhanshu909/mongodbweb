import React from 'react'
export const Row: React.FC = ({ children }) => {
  return (
    <div className='flex justify-between items-baseline'>
      {children instanceof Array ? (
        children.map((child, key) => (
          <div key={key} className='flex-auto mx-2'>
            {child}
          </div>
        ))
      ) : (
        <div className='flex-auto mx-2'>{children}</div>
      )}
    </div>
  )
}

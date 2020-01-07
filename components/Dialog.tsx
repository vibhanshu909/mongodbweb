import React from 'react'
import { useClickoutsideListenerRef } from '../hooks/useClickoutsideListenerRef'

interface IDialog {
  onClose: () => void
  position?: 'center' | 'left' | 'top' | 'right' | 'bottom'
}

export const Dialog: React.FC<IDialog> = props => {
  const { onClose, children } = props
  let { position = 'center' } = props
  const ref = useClickoutsideListenerRef(onClose)
  switch (position as IDialog['position']) {
    case 'center':
      position = 'm-auto'
      break
    case 'left':
      position = 'mr-auto h-full'
      break
    case 'top':
      position = 'mb-auto h-full'
      break
    case 'right':
      position = 'ml-auto h-full'
      break
    case 'bottom':
      position = 'mt-auto h-full'
      break
  }
  return (
    <div className='w-screen h-screen fixed inset-0 z-50 dialog-container'>
      <div className='flex h-full'>
        <div
          ref={ref}
          className={`bg-white p-3 md:w-1/3 max-w-3/4 ${position} rounded overflow-auto`}
        >
          {children}
        </div>
      </div>

      <style jsx={true}>{`
        .dialog-container {
          background-color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

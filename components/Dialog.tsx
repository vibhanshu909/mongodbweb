import React from 'react'
import { useClickoutsideListenerRef } from '../hooks/useClickoutsideListenerRef'

interface IDialog {
  onClose: () => void
  position?: 'center' | 'left' | 'top' | 'right' | 'bottom'
}

export const Dialog: React.FC<IDialog> = props => {
  const { onClose, children } = props
  const { position = 'center' } = props
  const ref = useClickoutsideListenerRef(onClose)
  let classNames = ''
  switch (position as IDialog['position']) {
    case 'center':
      classNames = 'm-auto'
      break
    case 'left':
      classNames = 'mr-auto h-full'
      break
    case 'top':
      classNames = 'mb-auto h-full'
      break
    case 'right':
      classNames = 'ml-auto h-full'
      break
    case 'bottom':
      classNames = 'mt-auto h-full'
      break
  }
  return (
    <div className='w-screen h-screen fixed inset-0 z-50 dialog-container'>
      <div className='flex h-full'>
        <div
          ref={ref}
          className={`bg-white p-3 md:w-1/3 max-w-3/4 ${classNames} rounded overflow-auto`}
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

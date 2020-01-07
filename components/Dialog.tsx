import React from 'react'
import { useClickoutsideListenerRef } from '../hooks/useClickoutsideListenerRef'
import { Button } from './Button'

interface IDialog {
  title: any
  onClose: () => void
  onPositive: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onNegative?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  positiveBtn?: React.FC
  nagativeBtn?: React.FC
}
const Dialog: React.FC<IDialog> = props => {
  const {
    title,
    children,
    onClose,
    onPositive,
    onNegative = onClose,
    positiveBtn = (
      <Button onClick={onPositive} color='danger'>
        Yes
      </Button>
    ),
    nagativeBtn = <Button onClick={onNegative}>No</Button>,
  } = props
  const ref = useClickoutsideListenerRef(onClose)
  return (
    <div className='w-screen h-screen fixed inset-0 z-50'>
      <div className='flex h-full dialog-container'>
        <div ref={ref} className='bg-white p-3 md:w-1/3 m-auto rounded'>
          <div>
            <h1 className='text-gray-900 text-2xl'>{title}</h1>
          </div>
          <div className='my-5 '>{children}</div>
          <div className='flex justify-between items-center'>
            <div className='mr-2'>{nagativeBtn}</div>
            <div>{positiveBtn}</div>
          </div>
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

export default Dialog

import React from 'react'
import { Button } from './Button'
import { Dialog } from './Dialog'

interface IConfirmDialog {
  title: any
  onClose: () => void
  onPositive?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onNegative?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  positiveBtn?: JSX.Element
  nagativeBtn?: JSX.Element
}

export const ConfirmDialog: React.FC<IConfirmDialog> = props => {
  const {
    title,
    children,
    onClose,
    onPositive = onClose,
    onNegative = onClose,
    positiveBtn = (
      <Button onClick={onPositive} color='danger'>
        Yes
      </Button>
    ),
    nagativeBtn = <Button onClick={onNegative}>No</Button>,
  } = props
  return (
    <Dialog onClose={onClose}>
      <div>
        <h1 className='text-gray-900 text-2xl'>{title}</h1>
      </div>
      <div className='my-5 h-full'>{children}</div>
      <div className='flex justify-between items-center'>
        <div className='mr-2'>{nagativeBtn}</div>
        <div>{positiveBtn}</div>
      </div>
    </Dialog>
  )
}

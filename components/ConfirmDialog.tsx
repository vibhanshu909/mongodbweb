import React from 'react'
import { Button } from './Button'
import { Dialog, IDialogProps } from './Dialog'

export interface IConfirmDialog extends IDialogProps {
  title: any
  onPositive?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onNegative?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  positiveBtn?: JSX.Element
  nagativeBtn?: JSX.Element
}

export const ConfirmDialog: React.FC<IConfirmDialog> = (props) => {
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
    ...restProps
  } = props
  return (
    <Dialog onClose={onClose} {...restProps}>
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

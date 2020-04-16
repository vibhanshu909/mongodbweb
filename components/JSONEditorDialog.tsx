import dynamic from 'next/dynamic'
import React from 'react'
import { useClickOutsideListenerRef } from '../hooks/useClickoutsideListenerRef'
import { Button } from './Button'
import { IConfirmDialog } from './ConfirmDialog'
import { IJSONEditorProps } from './JSONEditor'

const JSONEditor = dynamic(() => import('./JSONEditor'))

type IJSONEditorDialogProps = IConfirmDialog & IJSONEditorProps

export const JSONEditorDialog: React.FC<IJSONEditorDialogProps> = props => {
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
    content,
    getContent,
  } = props
  const ref = useClickOutsideListenerRef(onClose)
  return (
    <div className='w-screen h-screen fixed inset-0 z-50 dialog-container'>
      <div className='flex h-full'>
        <div
          ref={ref}
          className={`bg-white p-3 md:w-1/3 max-w-3/4 m-auto rounded overflow-auto`}
        >
          <div>
            <h1 className='text-gray-900 text-2xl'>{title}</h1>
          </div>
          <div className='my-5 h-full'>
            <JSONEditor content={content} getContent={getContent} />
          </div>
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

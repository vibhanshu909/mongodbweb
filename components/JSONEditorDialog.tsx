import { default as JSONEditorType } from 'jsoneditor'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useClickOutsideListenerRef } from '../hooks/useClickoutsideListenerRef'
import { Button } from './Button'
import { IConfirmDialog } from './ConfirmDialog'
import { LoadingButton } from './LoadingButton'

const JSONEditor = dynamic(() => import('./JSONEditor'))

interface IJSONEditorDialogProps extends Omit<IConfirmDialog, 'onPositive'> {
  content: any
  onPositive: (content: any) => void
  positiveJSX?: JSX.Element | string
  negativeJSX?: JSX.Element | string
  loading?: boolean
}

export const JSONEditorDialog: React.FC<IJSONEditorDialogProps> = (props) => {
  const {
    title,
    content,
    onClose,
    onPositive = onClose,
    onNegative = onClose,
    positiveJSX = 'Yes',
    negativeJSX = 'No',
    loading = false,
  } = props

  const {
    positiveBtn = (
      <LoadingButton
        loading={loading}
        onClick={() => onPositive(editor?.get())}
        color='success'
      >
        {positiveJSX}
      </LoadingButton>
    ),
    nagativeBtn = (
      <Button disabled={loading} onClick={onNegative}>
        {negativeJSX}
      </Button>
    ),
  } = props
  const [editor, setEditor] = useState((null as any) as JSONEditorType)

  useEffect(() => {
    editor?.set(content)
  }, [editor])
  const ref = useClickOutsideListenerRef(onClose)
  return (
    <div className='w-screen h-screen fixed inset-0 z-50 dialog-container'>
      <div className='flex h-full'>
        <div
          ref={ref}
          className={`bg-white p-3 w-full sm:w-2/3 md:max-w-3/4 m-auto rounded overflow-auto`}
        >
          <div>
            <h1 className='text-gray-900 text-2xl'>{title}</h1>
          </div>
          <div className='my-5 h-full'>
            <JSONEditor editor={editor} setEditor={setEditor} />
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

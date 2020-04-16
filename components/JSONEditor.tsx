import { default as JSONEditorType } from 'jsoneditor'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { waitForGlobal } from '../lib/utils/waitForGlobal'
import CircularLoader from './CircularLoader'

export interface IJSONEditorProps {
  content: any
  getContent?: (content: any) => void
}

export const JSONEditor: React.FC<IJSONEditorProps> = ({
  content,
  getContent,
}) => {
  const options = {
    mode: 'code',
  }
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const [editor, setEditor] = useState((null as any) as JSONEditorType)
  useEffect(() => {
    waitForGlobal('JSONEditor', () => setLoading(false))
  }, [])
  useEffect(() => {
    if (!loading && !editor && ref.current && (window as any).JSONEditor) {
      setEditor(new (window as any).JSONEditor(ref.current, options))
    }
  }, [loading, ref.current])

  useEffect(() => {
    editor?.set(content)
    return () => {
      getContent?.(editor?.get())
    }
  }, [editor])
  return (
    <>
      <Head>
        <link rel='stylesheet' href='jsoneditor.min.css' />
        <script src='jsoneditor.min.js' />
      </Head>
      {loading ? (
        <>
          <CircularLoader />
        </>
      ) : (
        <div ref={ref} />
      )}
    </>
  )
}

export default JSONEditor

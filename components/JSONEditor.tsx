import { default as JSONEditorType } from 'jsoneditor'
import React, { useEffect, useRef, useState } from 'react'
import { waitForGlobal } from '../lib/utils/waitForGlobal'
import CircularLoader from './CircularLoader'

export interface IJSONEditorProps {
  editor: JSONEditorType | null
  setEditor: React.Dispatch<React.SetStateAction<JSONEditorType>>
}

export const JSONEditor: React.FC<IJSONEditorProps> = ({
  editor,
  setEditor,
}) => {
  const options = {
    mode: 'code',
  }
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  useEffect(() => {
    if (!document.head.querySelector('script[src="jsoneditor.min.js"]')) {
      const script = document.createElement('script')
      script.src = 'jsoneditor.min.js'
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = 'jsoneditor.min.css'
      document.head.append(style, script)
    }
    waitForGlobal('JSONEditor', () => setLoading(false))
  }, [])
  useEffect(() => {
    if (!loading && !editor && ref.current && (window as any).JSONEditor) {
      setEditor(new (window as any).JSONEditor(ref.current, options))
    }
  }, [loading, ref.current])

  return <>{loading ? <CircularLoader /> : <div ref={ref} />}</>
}

export default JSONEditor

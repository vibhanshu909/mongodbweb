import React, { useCallback, useEffect, useRef, useState } from 'react'

interface ICollapse {
  title: string
}

const Collapse: React.FC<ICollapse> = props => {
  const { title, children } = props
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const toggleHandler = useCallback(e => {
    e.stopPropagation()
    setOpen(!open)
  }, [])
  useEffect(() => {
    if (ref.current) {
      (ref.current! as HTMLDetailsElement).addEventListener(
        'toggle',
        toggleHandler,
      )
      return () => {
        (ref.current! as HTMLDetailsElement).removeEventListener(
          'toggle',
          toggleHandler,
        )
      }
    }
  }, [ref.current])
  return (
    <details ref={ref} open={open}>
      <summary
        className='focus:outline-none focus:bg-blue-300 hover:bg-blue-200 break-all'
        title={title}
      >
        {title}
      </summary>
      {open && <div className='ml-2'>{children}</div>}
      <style jsx={true}>{`
        details[open] > summary {
          background-color: rgba(190, 227, 248, 0.25);
        }
      `}</style>
    </details>
  )
}

export default Collapse

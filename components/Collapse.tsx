import React, { useState } from 'react'

interface ICollapse {
  title: string
  open?: boolean
}
const Collapse: React.FC<ICollapse> = props => {
  const { title, children, open: defaultOpen = false } = props
  const [open, setOpen] = useState(defaultOpen)
  return (
    <details open={open} onClick={() => setOpen(!open)}>
      <summary
        className="focus:outline-none focus:bg-gray-800 hover:bg-gray-700 break-words"
        title={title}
      >
        {title}
      </summary>
      {children}
    </details>
  )
}

export default Collapse

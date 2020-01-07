import React from 'react'

interface ICollapse {
  title: string
  onDelete?: () => void
}

const Collapse: React.FC<ICollapse> = props => {
  const { title, children, onDelete } = props
  return (
    <details>
      <summary
        className='focus:outline-none focus:bg-blue-300 hover:bg-blue-200 break-all'
        title={title}
      >
        {title}
      </summary>
      <div className='ml-2'>{children}</div>
      <style jsx={true}>{`
        details[open] > summary {
          background-color: rgba(190, 227, 248, 0.25);
        }
      `}</style>
    </details>
  )
}

export default Collapse

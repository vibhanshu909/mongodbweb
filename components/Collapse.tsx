import React from 'react'

interface ICollapse {
  title: string
}

const Collapse: React.FC<ICollapse> = props => {
  const { title, children } = props
  return (
    <details>
      <summary
        className='focus:outline-none focus:bg-gray-800 hover:bg-gray-700 break-words'
        title={title}
      >
        {title}
      </summary>
      <div className='ml-2'>{children}</div>
      <style jsx={true}>{`
        details[open] > summary {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </details>
  )
}

export default Collapse

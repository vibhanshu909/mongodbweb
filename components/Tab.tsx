import React, { useEffect, useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'

const selectedClassName: HTMLButtonElement['className'] =
  'border-b-4 border-blue-600 text-blue-600'

interface ITabProps {
  tabs: {
    name: any
    content: any
  }[]
  selected: number
  onClose: (index: number) => void
}

export const Tab: React.FC<ITabProps> = props => {
  const { tabs, selected: defaultSelected, onClose } = props
  const [selected, setSelected] = useState(defaultSelected)
  useEffect(() => {
    setSelected(defaultSelected)
  }, [defaultSelected])
  const handleClick = (tabIndex: number) => () => {
    setSelected(tabIndex)
  }
  return (
    <div>
      <div className='sticky top-0 bg-white shadow'>
        <div className='inline-flex'>
          {tabs.map((tab, key) => {
            const className =
              'bg-transparent hover:bg-blue-100 text-sm py-2 px-4 focus:outline-none ' +
              (selected === key ? selectedClassName : '')
            if (key === 0) {
              return (
                <button
                  key={key}
                  className={className + ' rounded-l'}
                  onClick={handleClick(key)}
                >
                  {tab.name}
                  <FaTimesCircle
                    className='inline ml-2 text-red-400 hover:text-red-600'
                    title='Close Tab'
                    onClick={() => onClose(key)}
                  />
                </button>
              )
            } else if (key === tabs.length - 1) {
              return (
                <button
                  key={key}
                  className={className + '  rounded-r'}
                  onClick={handleClick(key)}
                >
                  {tab.name}
                  <FaTimesCircle
                    className='inline ml-2 text-red-400 hover:text-red-600'
                    title='Close Tab'
                    onClick={() => onClose(key)}
                  />
                </button>
              )
            } else {
              return (
                <button
                  key={key}
                  className={className}
                  onClick={handleClick(key)}
                >
                  {tab.name}
                  <FaTimesCircle
                    className='inline ml-2 text-red-400 hover:text-red-600'
                    title='Close Tab'
                    onClick={() => onClose(key)}
                  />
                </button>
              )
            }
          })}
        </div>
      </div>
      {tabs.map((tab, key) => (
        <div key={key} style={{ display: key === selected ? 'block' : 'none' }}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}

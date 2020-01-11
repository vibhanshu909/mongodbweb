import React, { useEffect, useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { selectedClassName } from '../pages/test'

interface ITabProps {
  tabs: Array<{
    name: any
    content: any
  }>
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
      <div className='inline-flex'>
        {tabs.map((tab, key) => {
          const className =
            'bg-transparent hover:bg-gray-400 text-sm py-2 px-4 focus:outline-none ' +
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
            return
          }
        })}
      </div>
      <div>{tabs[selected].content}</div>
    </div>
  )
}

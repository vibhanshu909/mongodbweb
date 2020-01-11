import React, { useContext } from 'react'
import { CollectionContext } from './CollectionContext/CollectionContext'
import EnhancedMenu, { MenuItem } from './EnhancedMenu'

export const CollectionButton: React.FC<{
  server: string
  database: string
  collection: string
  params?: any
  count: number
}> = props => {
  const { server, database, collection, params, count } = props
  const { setPayload } = useContext(CollectionContext)
  const fireQuery = () => {
    setPayload(prev => ({
      ...prev,
      tabs: [
        ...prev.tabs,
        {
          server,
          database,
          collection,
        },
      ],
    }))
  }
  return (
    <div>
      <button
        className='select-none w-full px-2 focus:bg-blue-600 focus:outline-none'
        onDoubleClick={fireQuery}
      >
        <div className='flex flex-no-wrap justify-between items-baseline'>
          <div className='mx-2'>
            <span>{collection}</span>
          </div>
          <div className='mx-2'>
            <div className='flex flex-no-wrap items-baseline'>
              <div className='mx-1'>
                <span>{count}</span>
              </div>
              <div className='mx-1'>
                <EnhancedMenu>
                  {count ? (
                    <MenuItem onClick={fireQuery}>View data</MenuItem>
                  ) : null}
                  <MenuItem>Delete</MenuItem>
                </EnhancedMenu>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

import React, { useContext } from 'react'
import { IFindInputType } from '../generated/graphql'
import { CollectionContext } from './CollectionContext/CollectionContext'
import EnhancedMenu, { MenuItem } from './EnhancedMenu'

const defaultParams = {
  limit: 20,
  query: '{}',
  skip: 0,
  sort: '{}',
} as IFindInputType

export const CollectionButton: React.FC<{
  server: string
  database: string
  collection: string
  count: number
}> = props => {
  const { server, database, collection, count } = props
  const { setPayload } = useContext(CollectionContext)
  const fireQuery = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setPayload(prev => {
      if (
        prev.tabs.some(
          tab =>
            tab.server === server &&
            tab.database === database &&
            tab.collection === collection,
        )
      ) {
        return prev
      }
      return {
        ...prev,
        tabs: [
          ...prev.tabs,
          {
            server,
            database,
            collection,
            count,
            params: { ...defaultParams },
          },
        ],
      }
    })
  }
  return (
    <a
      href=''
      onClick={e => e.preventDefault()}
      className='block select-none w-full px-2 hover:bg-blue-200 focus:bg-blue-300 focus:outline-none'
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
            <div className='mx-1 text-center'>
              <EnhancedMenu>
                <MenuItem onClick={fireQuery}>Open Collection</MenuItem>
                <MenuItem>Delete</MenuItem>
              </EnhancedMenu>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

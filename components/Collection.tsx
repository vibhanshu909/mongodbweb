import React, { useContext } from 'react'
import { CollectionContext } from '../pages/_app'

export const Collection: React.FC = () => {
  const { payload } = useContext(CollectionContext)
  if (payload.collectionData?.length) {
    return (
      <div className='flex flex-col'>
        {payload.collectionData?.map((document, key) => (
          <div className='m-2' key={key}>
            <pre className='bg-gray-700 p-1'>
              {JSON.stringify(document, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    )
  }
  return null
}

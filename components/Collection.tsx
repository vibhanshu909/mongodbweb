import React, { useContext } from 'react'
import { CollectionContext } from '../pages/_app'

export const Collection: React.FC = () => {
  const { payload } = useContext(CollectionContext)
  console.log('payload', payload)
  if (payload.collectionData?.length) {
    return (
      <div className='flex flex-col'>
        {payload.collectionData?.map((document, key) => (
          <div className='collection mt-4 p-2' key={key}>
            <pre className='bg-gray-100 p-2 rounded'>
              {JSON.stringify(document, null, 2)}
            </pre>
          </div>
        ))}
        <style>{`
  .collection:first-child {
    margin-top: 0;
  }`}</style>
      </div>
    )
  }
  return null
}

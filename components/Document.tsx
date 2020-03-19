import React from 'react'

export const Document: React.FC<{
  document: any
}> = ({ document }) => {
  return (
    <div className='collection mt-4 p-2'>
      <pre className='bg-gray-100 p-2 rounded hover:shadow-md'>
        {JSON.stringify(document, null, 2)}
      </pre>
      <style>{`
  .collection:first-child {
    margin-top: 0;
  }`}</style>
    </div>
  )
}

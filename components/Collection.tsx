import React, { useContext, useState } from 'react'
import { IFindInputType, useQueryQueryQuery } from '../generated/graphql'
import CircularLoader from './CircularLoader'
import { CollectionContext } from './CollectionContext/CollectionContext'
import { Tab } from './Tab'

export const Document: React.FC<{ document: any }> = ({ document }) => {
  return (
    <div className='collection mt-4 p-2'>
      <pre className='bg-gray-100 p-2 rounded'>
        {JSON.stringify(document, null, 2)}
      </pre>
      <style>{`
  .collection:first-child {
    margin-top: 0;
  }`}</style>
    </div>
  )
}

export interface ICollectionViewer {
  server: string
  database: string
  collection: string
}

export const CollectionViewer: React.FC<ICollectionViewer> = ({
  server,
  database,
  collection,
}) => {
  const [params, setParams] = useState({
    limit: 20,
    query: {},
    skip: 0,
    sort: {},
  } as IFindInputType)
  const { loading, data, error } = useQueryQueryQuery({
    variables: {
      uri: server,
      database,
      collection,
      params,
    },
  })

  if (loading) {
    return <CircularLoader className='text-center' />
  }
  if (data && data.query) {
    return (
      <>
        {(data.query as any[]).map((document, key) => (
          <Document key={key} document={document} />
        ))}
      </>
    )
  } else {
    return <p>Something went wrong!</p>
  }
}

export const Collection: React.FC = () => {
  const { payload, setPayload } = useContext(CollectionContext)
  console.log('payload', payload)
  if (payload.tabs.length) {
    return (
      <Tab
        selected={payload.tabs.length - 1}
        onClose={index => {
          setPayload(prev => ({
            ...prev,
            tabs: prev.tabs.slice(0, index).concat(prev.tabs.slice(index + 1)),
          }))
        }}
        tabs={payload.tabs.map((tab, key) => {
          return {
            name: tab.collection,
            content: <CollectionViewer {...tab} />,
          }
        })}
      />
    )
  }
  return null
}

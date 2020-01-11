import React, { useContext, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IFindInputType, useQueryQueryQuery } from '../generated/graphql'
import { Button } from './Button'
import CircularLoader from './CircularLoader'
import { CollectionContext } from './CollectionContext/CollectionContext'
import { Tab } from './Tab'

export const Document: React.FC<{ document: any }> = ({ document }) => {
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
    return (
      <div className='flex flex-col h-full items-center'>
        <div className=''>
          <CircularLoader className='text-6xl' />
        </div>
      </div>
    )
  }
  if (data && data.query) {
    return (
      <>
        <div className='sticky top bg-white z-0'>
          <FilterForm />
        </div>
        <style jsx={true}>{`
          .top {
            top: 2.5rem;
          }
        `}</style>
        {(data.query as any[]).map((document, key) => (
          <Document key={key} document={document} />
        ))}
      </>
    )
  } else {
    return <p>Something went wrong!</p>
  }
}

const FilterForm = () => {
  return (
    <form
      className='border border-gray-200 rounded p-2'
      onSubmit={async e => {
        e.preventDefault()
      }}
    >
      <div className='flex flex-wrap md:flex-no-wrap items-end'>
        <div className='mr-0 md:mr-4 flex-auto'>
          <label className='block text-sm font-bold mb-2' htmlFor='query'>
            Query
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            id='query'
            type='text'
            defaultValue='{}'
          />
        </div>
        <div className='mr-0 md:mr-4 flex-auto'>
          <label className='block text-sm font-bold mb-2' htmlFor='skip'>
            Skip
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            id='skip'
            type='text'
            defaultValue={0}
          />
        </div>
        <div className='mr-0 md:mr-4 flex-auto'>
          <label className='block text-sm font-bold mb-2' htmlFor='Limit'>
            Limit
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            id='Limit'
            type='text'
            defaultValue={20}
          />
        </div>
        <div className='mr-0 md:mr-4 flex-auto'>
          <label className='block text-sm font-bold mb-2' htmlFor='sort'>
            Sort
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            id='sort'
            type='text'
            defaultValue={'{}'}
          />
        </div>
        {/* <div className='flex-auto w-full md:w-auto'> */}
        <Button className='flex-auto w-full mt-4 md:w-auto md:mt-0'>
          <FaCheckCircle className='inline-block' /> Apply
        </Button>
        {/* </div> */}
      </div>
    </form>
  )
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

import React, { useContext, useRef, useState } from 'react'
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
} from 'react-icons/fa'
import { IFindInputType, useQueryQueryQuery } from '../generated/graphql'
import CircularLoader from './CircularLoader'
import { CollectionContext } from './CollectionContext/CollectionContext'
import { IconButton } from './IconButton'
import { Tab } from './Tab'
import Table from './Table'

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
  count: number
  params: IFindInputType
}

export const CollectionViewer: React.FC<{
  dataKey: number
}> = ({ dataKey }) => {
  const { payload, setPayload } = useContext(CollectionContext)
  const { server, database, collection, count, params } = payload.tabs[dataKey]
  const { loading, data } = useQueryQueryQuery({
    variables: {
      uri: server,
      database,
      collection,
      params: {
        ...params,
        query: JSON.parse(params.query),
        sort: JSON.parse(params.sort),
      },
    },
  })
  const queryRef = useRef(null)
  const [error, setError] = useState('')
  if (loading) {
    return (
      <div className='flex items-center'>
        <CircularLoader className='text-6xl' />
      </div>
    )
  }
  if (data && data.query) {
    return (
      <>
        <div className='sticky top bg-white z-0'>
          <div className='flex flex-wrap justify-center md:justify-between items-center'>
            <div>
              <div className='inline-flex border-2 border-gray-400 rounded-full'>
                <input
                  type='text'
                  className='m-2 mr-0 focus:outline-none'
                  defaultValue={params.query ?? '{}'}
                  ref={queryRef}
                />
                <IconButton
                  onClick={() => {
                    try {
                      const query = (queryRef.current! as HTMLInputElement)
                        .value
                      JSON.parse(query)
                      setPayload(prev => {
                        const result = {
                          ...prev,
                          tabs: [...prev.tabs],
                        }
                        result.tabs[dataKey].params.query = query
                        return result
                      })
                      setError('')
                    } catch (error) {
                      setError('Invalid JSON')
                    }
                  }}
                >
                  <FaSearch />
                </IconButton>
              </div>
              {error && <div>{error}</div>}
            </div>
            <div>
              <div className='flex flex-col items-center mr-2'>
                <div>
                  <p>
                    Documents
                    <span className='text-green-500'>
                      {` ${params.skip! + 1} - ${
                        params.limit! < count
                          ? params.skip! + params.limit!
                          : count
                      } `}
                    </span>
                    of <span className='text-green-500'>{count}</span>
                  </p>
                </div>
                <div>
                  <div className='inline-flex'>
                    <IconButton
                      title='Go to first page'
                      disabled={!params.skip}
                      onClick={() => {
                        setPayload(prev => {
                          const result = {
                            ...prev,
                            tabs: [...prev.tabs],
                          }
                          result.tabs[dataKey].params.skip! = 0
                          return result
                        })
                      }}
                    >
                      <FaAngleDoubleLeft />
                    </IconButton>
                    <IconButton
                      title='Prev'
                      disabled={!params.skip}
                      onClick={() => {
                        setPayload(prev => {
                          const result = {
                            ...prev,
                            tabs: [...prev.tabs],
                          }
                          result.tabs[dataKey].params.skip! -= result.tabs[
                            dataKey
                          ].params.limit!
                          if (result.tabs[dataKey].params.skip! < 0) {
                            result.tabs[dataKey].params.skip! = 0
                          }
                          return result
                        })
                      }}
                    >
                      <FaAngleLeft />
                    </IconButton>
                    <select
                      className='focus:outline-none'
                      value={params.limit!}
                      onChange={e => {
                        const limit = e.target.value
                        setPayload(prev => {
                          const result = {
                            ...prev,
                            tabs: [...prev.tabs],
                          }
                          result.tabs[dataKey].params.limit = parseInt(limit)
                          return result
                        })
                      }}
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <IconButton
                      title='Next'
                      disabled={params.skip! + params.limit! >= count}
                      onClick={() => {
                        setPayload(prev => {
                          const result = {
                            ...prev,
                            tabs: [...prev.tabs],
                          }
                          result.tabs[dataKey].params.skip! += result.tabs[
                            dataKey
                          ].params.limit!
                          return result
                        })
                      }}
                    >
                      <FaAngleRight />
                    </IconButton>
                    <IconButton
                      title='Go to last page'
                      disabled={params.skip! + params.limit! >= count}
                      onClick={() => {
                        setPayload(prev => {
                          const result = {
                            ...prev,
                            tabs: [...prev.tabs],
                          }
                          result.tabs[dataKey].params.skip! =
                            result.tabs[dataKey].params.limit! *
                            Math.floor(
                              count / result.tabs[dataKey].params.limit!,
                            )
                          return result
                        })
                      }}
                    >
                      <FaAngleDoubleRight />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx={true}>{`
          .top {
            top: 2.5rem;
          }
        `}</style>
        <div className='text-xs'>
          <Table data={data.query} />
        </div>

        {/* {(data.query as any[]).map((document, key) => (
          <>
            <span>{key}: </span>
            <Document key={key} document={document} />
          </>
        ))} */}
      </>
    )
  } else {
    return <p>Something went wrong!</p>
  }
}

export const Collection: React.FC = () => {
  const { payload, setPayload } = useContext(CollectionContext)
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
            content: (
              <CollectionViewer
                key={`${tab.server}>${tab.database}>${tab.collection}`}
                dataKey={key}
              />
            ),
          }
        })}
      />
    )
  }
  return null
}

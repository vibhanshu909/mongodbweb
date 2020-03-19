import React, { useContext, useRef, useState } from 'react'
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaCopy,
  FaPencilAlt,
  FaPlusCircle,
  FaSearch,
  FaTrashAlt,
} from 'react-icons/fa'
import {
  IFindInputType,
  useCreateMutation,
  useQueryQueryQuery,
} from '../generated/graphql'
import { Button } from './Button'
import CircularLoader from './CircularLoader'
import { CollectionContext } from './CollectionContext/CollectionContext'
import { ConfirmDialog } from './ConfirmDialog'
import { Document } from './Document'
import { IconButton } from './IconButton'
import Table from './Table'

enum Dialog {
  NONE = 'NONE',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

enum View {
  TABLE = 'TABLE',
  JSON = 'JSON',
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
  const { loading, data, refetch } = useQueryQueryQuery({
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
  const [open, setOpen] = useState(Dialog.NONE)
  const [document, setDocument] = useState('{}')
  const [view, setView] = useState(View.TABLE)
  const [selected, setSelected] = useState([] as number[])
  const [createMutation] = useCreateMutation()
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
          <div className='flex flex-wrap md:justify-between items-center'>
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
                        params.skip! + params.limit! < count
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
                      {count > 20 && <option value={50}>50</option>}
                      {count > 50 && <option value={100}>100</option>}
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
        <div className='flex items-center'>
          <div>
            <IconButton
              title='Add Document'
              onClick={() => setOpen(Dialog.CREATE)}
            >
              <FaPlusCircle />
            </IconButton>
            {open === Dialog.CREATE && (
              <ConfirmDialog
                title='Insert Document'
                onClose={() => setOpen(Dialog.NONE)}
                positiveBtn={
                  <Button
                    color='success'
                    onClick={async () => {
                      try {
                        const { data } = await createMutation({
                          variables: {
                            uri: server,
                            database,
                            collection,
                            document,
                          },
                        })
                        console.log('data', data)
                        setOpen(Dialog.NONE)
                        await refetch()
                      } catch (error) {
                        alert(error.message)
                      }
                    }}
                  >
                    Add Document
                  </Button>
                }
              >
                <div className='text-base'>
                  <textarea
                    className='w-full'
                    name='document'
                    rows={10}
                    value={document}
                    onChange={e => {
                      const newDoc = e.target.value
                      setDocument(newDoc)
                    }}
                    autoFocus={true}
                  />
                </div>
              </ConfirmDialog>
            )}
          </div>
          <div>
            <IconButton
              title={'Edit Document'}
              disabled={selected.length !== 1}
              onClick={() => setOpen(Dialog.UPDATE)}
            >
              <FaPencilAlt />
            </IconButton>
            {open === Dialog.UPDATE && (
              <ConfirmDialog
                title='Insert Document'
                onClose={() => setOpen(Dialog.NONE)}
                positiveBtn={
                  <Button
                    color='success'
                    onClick={async () => {
                      try {
                        const { data } = await createMutation({
                          variables: {
                            uri: server,
                            database,
                            collection,
                            document,
                          },
                        })
                        console.log('data', data)
                        setOpen(Dialog.NONE)
                        await refetch()
                      } catch (error) {
                        alert(error.message)
                      }
                    }}
                  >
                    Add Document
                  </Button>
                }
              >
                <div className='text-base'>
                  <textarea
                    className='w-full'
                    name='document'
                    rows={10}
                    value={document}
                    onChange={e => {
                      const newDoc = e.target.value
                      setDocument(newDoc)
                    }}
                    autoFocus={true}
                  />
                </div>
              </ConfirmDialog>
            )}
          </div>
          <div>
            <IconButton
              disabled={selected.length !== 1}
              title={'Copy Document'}
            >
              <FaCopy />
            </IconButton>
          </div>
          <div>
            <IconButton
              disabled={selected.length === 0}
              title={'Remove Document'}
            >
              <FaTrashAlt />
            </IconButton>
          </div>
          <div>
            <select
              value={view}
              onChange={e => {
                setView(e.target.value as View)
              }}
              className='focus:outline-none'
            >
              <option value={View.TABLE}>Table View</option>
              <option value={View.JSON}>JSON View</option>
            </select>
          </div>
        </div>
        <div className='text-xs'>
          {view === View.TABLE ? (
            <Table
              data={data.query}
              selected={selected}
              onSelect={index => {
                if (!selected.includes(index)) {
                  setSelected(prev => [...prev, index])
                }
              }}
              onUnSelect={index => {
                setSelected(prev => prev.filter(e => e !== index))
              }}
              onSelectAll={all => {
                if (all) {
                  setSelected((data.query as any[]).map((_, index) => index))
                } else {
                  setSelected([])
                }
              }}
            />
          ) : (
            (data.query as any[]).map(d => (
              <Document key={d._id} document={d} />
            ))
          )}
        </div>
      </>
    )
  } else {
    return <p>Something went wrong!</p>
  }
}

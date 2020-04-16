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
} from 'react-icons/fa'
import {
  IFindInputType,
  useCreateMutation,
  useDeleteMutation,
  useQueryQueryQuery,
  useUpdateMutation,
} from '../generated/graphql'
import { filterObject } from '../lib/utils/filterObject'
import CircularLoader from './CircularLoader'
import { CollectionContext } from './CollectionContext/CollectionContext'
import { DeleteButton } from './DeleteButton'
import { Document } from './Document'
import { IconButton } from './IconButton'
import { JSONEditorDialog } from './JSONEditorDialog'
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
  const [opLoading, setOpLoading] = useState(undefined as any)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(Dialog.NONE)
  const [view, setView] = useState(View.TABLE)
  const [selected, setSelected] = useState([] as number[])
  const [createMutation] = useCreateMutation()
  const [updateMutation] = useUpdateMutation()
  const [deleteMutation] = useDeleteMutation()
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
                      setPayload((prev) => {
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
                        setPayload((prev) => {
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
                        setPayload((prev) => {
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
                      onChange={(e) => {
                        const limit = e.target.value
                        setPayload((prev) => {
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
                        setPayload((prev) => {
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
                        setPayload((prev) => {
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
              <JSONEditorDialog
                title='Insert Document'
                content={{}}
                loading={opLoading}
                onClose={() => setOpen(Dialog.NONE)}
                positiveJSX='Add Document'
                onPositive={async (content) => {
                  setOpLoading(true)
                  try {
                    await createMutation({
                      variables: {
                        uri: server,
                        database,
                        collection,
                        document: JSON.stringify(content),
                      },
                    })
                    setOpen(Dialog.NONE)
                    await refetch()
                  } catch (error) {
                    alert(error.message)
                  } finally {
                    setOpLoading(undefined)
                  }
                }}
              />
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
              <JSONEditorDialog
                title='Edit Document'
                content={filterObject(data.query[selected[0]], ['_id'])}
                loading={opLoading}
                onClose={() => setOpen(Dialog.NONE)}
                positiveJSX='Update Document'
                onPositive={async (content) => {
                  const id = data.query[selected[0]]._id
                  setOpLoading(id)
                  try {
                    await updateMutation({
                      variables: {
                        uri: server,
                        database,
                        collection,
                        id,
                        document: JSON.stringify(content),
                      },
                    })
                    await refetch()
                    setOpen(Dialog.NONE)
                  } catch (error) {
                    alert(error.message)
                  } finally {
                    setOpLoading(undefined)
                  }
                }}
              />
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
            <DeleteButton
              disabled={selected.length === 0}
              title={'Delete Document'}
              onClick={async () => {
                setOpLoading(true)
                try {
                  const ids = selected.map((index) => data.query[index]._id)
                  await deleteMutation({
                    variables: {
                      uri: server,
                      database,
                      collection,
                      ids,
                    },
                  })
                  await refetch()
                } catch (error) {
                  alert(error.message)
                } finally {
                  setOpLoading(undefined)
                }
              }}
            />
          </div>
          <div>
            <select
              value={view}
              onChange={(e) => {
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
              onSelect={(index) => {
                if (!selected.includes(index)) {
                  setSelected((prev) => [...prev, index])
                }
              }}
              onUnSelect={(index) => {
                setSelected((prev) => prev.filter((e) => e !== index))
              }}
              onSelectAll={(all) => {
                if (all) {
                  setSelected((data.query as any[]).map((_, index) => index))
                } else {
                  setSelected([])
                }
              }}
            />
          ) : (
            (data.query as any[]).map((d) => (
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

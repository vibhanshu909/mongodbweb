import React, { useContext, useEffect, useRef } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useCheckServerQueryLazyQuery } from '../generated/graphql'
import { LoadingButton } from './LoadingButton'
import { LocalStorageContext } from './LocalStorageContext/LocalStorageContext'

export const AddServerForm = () => {
  const { setPayload } = useContext(LocalStorageContext)
  const inputRef = useRef(null)
  const formRef = useRef(null)
  const [checkServer, { data, loading, error }] = useCheckServerQueryLazyQuery({
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (data && data.checkServer) {
      setPayload((prev: any) => {
        const newState = {
          ...prev,
        }
        const newServer = (inputRef.current! as HTMLInputElement).value
        const url = new URL(newServer)
        if (prev.servers) {
          const found = (prev.servers as any[]).findIndex((s: string) =>
            s.includes(url.pathname),
          )
          if (found < 0) {
            newState.servers = [...prev.servers, newServer]
          }
          // else No action required.
        } else {
          newState.servers = [newServer]
        }
        return newState
      })
      ;(formRef.current! as HTMLFormElement).reset()
    }
  }, [loading, data])

  return (
    <form
      ref={formRef}
      className='border border-gray-200 rounded p-2'
      onSubmit={async e => {
        e.preventDefault()
        const uri = (inputRef.current! as HTMLInputElement).value
        checkServer({
          variables: {
            uri,
          },
        })
      }}
    >
      <div className='flex items-end'>
        <div className='mr-4 flex-auto'>
          <label className='block text-sm font-bold mb-2' htmlFor='username'>
            Mongodb URI
          </label>
          <input
            ref={inputRef}
            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
            id='username'
            type='text'
            placeholder='mongodb://<username>:<password>@<host>/<db_name>'
          />
          {(error || (data && !data.checkServer)) && (
            <span className='text-red-400'>Failed to connect</span>
          )}
        </div>
        <div>
          <LoadingButton loading={loading}>
            <FaPlus className='inline-block' /> Add
          </LoadingButton>
        </div>
      </div>
    </form>
  )
}

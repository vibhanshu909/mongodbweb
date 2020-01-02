import React, { useContext, useEffect, useRef } from 'react'
import { useCheckServerQueryLazyQuery } from '../generated/graphql'
import CircularLoader from './CircularLoader'
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
        let newState = {
          ...prev,
        }
        const newServer = (inputRef.current! as HTMLInputElement).value
        if (prev.servers && !prev.servers.includes(newServer)) {
          newState.servers = [...prev.servers, newServer]
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
      className="text-white border border-gray-700 rounded px-8 pt-6 pb-8 mb-4"
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
      <div className="flex items-end">
        <div className="mr-4 flex-auto">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Mongodb URI
          </label>
          <input
            ref={inputRef}
            className="text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="mongodb://<username>:<password>@<host>/<db_name>"
          />
          {(error || (data && !data.checkServer)) && (
            <span className="text-red-400">Failed to connect</span>
          )}
        </div>
        <div className="">
          <button
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading &&
              'opacity-50 cursor-not-allowed'}`}
            type="submit"
          >
            {loading && <CircularLoader />} <span> Add</span>
          </button>
        </div>
      </div>
    </form>
  )
}

import { NextPage } from 'next'
import React, { useContext } from 'react'
import NoSSR from 'react-no-ssr'
import { AddServerForm } from '../components/AddServerForm'
import Collapse from '../components/Collapse'
import { Collection } from '../components/Collection'
import { LocalStorageContext } from '../components/LocalStorageContext/LocalStorageContext'

const Index: NextPage = () => {
  const { payload } = useContext(LocalStorageContext)
  console.log('servers', payload)
  return (
    <div>
      <div className="my-3">
        <NoSSR>
          <AddServerForm />
        </NoSSR>
      </div>
      <div className="flex">
        <div className="self-start mx-2 bg-gray-800 p-4 sticky top-0 max-w-sm">
          {payload?.servers?.map((server: string) => {
            return <Collapse title={server} />
          })}
          {/* {payload.servers.map((connections, key) => {
          return (
            <Details
              key={key}
              title={connections.name}
              data={connections.databases}
              children={({ data }) => (
                <Details
                  title={data.name}
                  data={data.collections}
                  children={({ data }) => (
                    <CollectionButton name={data.name} count={data.count} />
                  )}
                />
              )}
            />
          )
        })} */}
        </div>
        <div className="flex-auto mx-2 bg-gray-800 min-h-full p-4">
          <Collection />
        </div>
      </div>
    </div>
  )
}

// Index.getInitialProps = async ({ req, AppTree: { defaultProps } }) => {
//   console.log('defaultProps', defaultProps)
//   try {
//     const { data } = await axios.get(
//       `${
//         req?.headers.host
//           ? (process.env.NODE_ENV === 'development' ? 'http' : 'https') +
//             '://' +
//             req?.headers.host
//           : ''
//       }/api/servers`,
//     )
//     return { data }
//   } catch (error) {
//     console.log('error', error.message)
//   }
//   return { data: null }
// }

export default Index

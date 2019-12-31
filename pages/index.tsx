import { NextPage } from 'next'
import React from 'react'
import { Collection } from '../components/Collection'

const AddServerForm = () => {
  return <form></form>
}
const Index: NextPage = () => {
  // const { payload, setPayload } = useContext(CollectionContext)
  // useEffect(() => {
  //   setPayload(prev => ({ ...prev, servers: data }))
  // }, [data])
  return (
    <div>
      <div className="my-3">
        <AddServerForm />
      </div>
      <div className="flex">
        <div className="self-start mx-2 bg-gray-800 p-4 sticky top-0">
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

import { ApolloProvider } from '@apollo/react-hooks'
import App from 'next/app'
import React, { useState } from 'react'
import LocalStorageProvider from '../components/LocalStorageContext/LocalStorageProvider'
import Layout from '../Layout'
import withData from '../lib/apollo-client'
import '../styles/main.css'

export interface ICollectionContext {
  name: string
  size: number
  databases: Array<{
    name: string
    size: number
    dataSize: number
    avgObjSize: number | null
    storageSize: number
    totalIndexSize: number
    empty: boolean
    collections: Array<{
      name: string
      size: number
      dataSize: number
      avgObjSize: number | null
      storageSize: number
      capped: boolean
      nIndexes: number
      totalIndexSize: number
      indexSizes: {
        [key: string]: number
      }
    }>
  }>
}
interface ICollectionContextPayload {
  servers: ICollectionContext[]
  collectionData: {
    ok: boolean
    results: Array<any>
  } | null
}
// setPayload: React.Dispatch<React.SetStateAction<ICollectionContextPayload>>;
export const CollectionContext = React.createContext({
  payload: {
    servers: [],
    collectionData: null,
  },
  setPayload: () => null,
} as { payload: ICollectionContextPayload; setPayload: React.Dispatch<React.SetStateAction<ICollectionContextPayload>> })

export const CollectionContextProvider: React.FC = ({ children }) => {
  const [data, setData] = useState({
    servers: [],
    collectionData: null,
  })
  return (
    <CollectionContext.Provider
      value={{ payload: data, setPayload: setData as any }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

class MyApp extends App<any, any, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }
  componentDidCatch(error: Error, info: any) {
    // Display fallback UI
    this.setState({ hasError: true })
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gray-900">
          <h1 className="text-center my-auto text-red-400">
            Something went wrong.
          </h1>
        </div>
      )
    }
    const { Component, pageProps } = this.props
    const { apollo } = this.props as any
    return (
      <ApolloProvider client={apollo}>
        <LocalStorageProvider name="servers">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LocalStorageProvider>
      </ApolloProvider>
    )
  }
}

export default withData(MyApp)

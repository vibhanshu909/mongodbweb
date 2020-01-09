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
  collectionData: any[] | null
}

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
  componentDidCatch(error: Error, info: any) {
    this.setState({ hasError: true })
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen bg-gray-900'>
          <h1 className='text-center my-auto text-red-400'>
            Something went wrong.
          </h1>
        </div>
      )
    }
    const { Component, pageProps } = this.props
    const { apollo } = this.props as any
    return (
      <ApolloProvider client={apollo}>
        <LocalStorageProvider name='servers'>
          <CollectionContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CollectionContextProvider>
        </LocalStorageProvider>
      </ApolloProvider>
    )
  }
}

export default withData(MyApp)

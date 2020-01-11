import { ApolloProvider } from '@apollo/react-hooks'
import App from 'next/app'
import React from 'react'
import { CollectionContextProvider } from '../components/CollectionContext/CollectionContextProvider'
import LocalStorageProvider from '../components/LocalStorageContext/LocalStorageProvider'
import Layout from '../Layout'
import withData from '../lib/apollo-client'
import '../styles/main.css'

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

import Head from 'next/head'
import React from 'react'

const Layout: React.FC = ({ children }) => {
  return (
    <div className='min-h-screen p-4 bg-gray-900 text-white'>
      <Head>
        <title>Web studio for mongodb</title>
        <meta
          name='description'
          content='This is a simple web application that allows you to connect to your mongodb server and perform CRUD operations.'
        />
      </Head>
      {children}
    </div>
  )
}

export default Layout

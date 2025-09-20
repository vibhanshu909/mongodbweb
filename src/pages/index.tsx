import { NextPage } from 'next'
import Head from 'next/head'
import { MongoDBWeb } from '@/components/MongoDBWeb'

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>MongoDB Web - Database Management Interface</title>
        <meta
          name="description"
          content="Modern web interface for MongoDB databases with full CRUD operations"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MongoDBWeb />
    </>
  )
}

export default HomePage

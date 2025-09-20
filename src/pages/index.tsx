import { NextPage } from 'next'
import Head from 'next/head'
import { MongoDBWeb } from '@/components/MongoDBWeb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const HomePage: NextPage = () => {
  const title = 'MongoDB Web - Database Management Interface'
  const description = 'Modern web interface for MongoDB databases with full CRUD operations'
  const image = `${SITE_URL}/images/logo.png`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MongoDB Web',
    url: SITE_URL,
    description,
    applicationCategory: 'DeveloperApplication',
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={image} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* JSON-LD structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <MongoDBWeb />
    </>
  )
}

export default HomePage

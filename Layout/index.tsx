import Head from 'next/head'
import React from 'react'

const Layout: React.FC = ({ children }) => {
  return (
    <div className='min-h-screen p-4 bg-gray-900 text-white text-lg'>
      <Head>
        <title>Web studio for mongodb</title>
        <meta
          name='description'
          content='A simple web application that allows you to connect to your mongodb server and perform CRUD operations.'
        />
        <script
          data-ad-client='ca-pub-5720468470042472'
          async={true}
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N4CNTSH');`,
          }}
        />
      </Head>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N4CNTSH"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      {children}
    </div>
  )
}

export default Layout

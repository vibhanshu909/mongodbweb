import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Primary meta tags */}
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#0f172a" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          {/* Preconnect to commonly used origins (add if using external assets) */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

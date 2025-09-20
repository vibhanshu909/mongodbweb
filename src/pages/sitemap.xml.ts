import { GetServerSideProps } from 'next'

const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'

function buildSitemapXml(urls: Array<{ loc: string; lastmod?: string }>) {
  const urlEntries = urls
    .map(({ loc, lastmod }) => {
      return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // For now include only the homepage. Extend this to include dynamic routes.
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: new Date().toISOString() },
  ]

  const xml = buildSitemapXml(urls)

  res.setHeader('Content-Type', 'application/xml')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  // getServerSideProps handles response
  return null
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getServerSideProps({ res }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const trips = await prisma.trip.findMany({ select: { slug: true, updatedAt: true } })

  const pages = [
    { url: '', priority: 1.0 },
    { url: 'search', priority: 0.8 }
  ]

  const xmlParts = []
  xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>')
  xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

  for (const p of pages) {
    xmlParts.push('<url>')
    xmlParts.push(`<loc>${siteUrl}/${p.url}</loc>`)
    xmlParts.push(`<priority>${p.priority}</priority>`)
    xmlParts.push('</url>')
  }

  for (const t of trips) {
    xmlParts.push('<url>')
    xmlParts.push(`<loc>${siteUrl}/trips/${t.slug}</loc>`)
    xmlParts.push(`<lastmod>${t.updatedAt.toISOString()}</lastmod>`)
    xmlParts.push('<priority>0.7</priority>')
    xmlParts.push('</url>')
  }

  xmlParts.push('</urlset>')
  const xml = xmlParts.join('\n')

  res.setHeader('Content-Type', 'application/xml')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  // getServerSideProps will do the heavy lifting
  return null
}

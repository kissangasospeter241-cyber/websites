import Head from 'next/head'

export default function SEO({
  title = 'Tanzania Safaris | African Victory Safari',
  description = 'Luxury and mid-range Tanzania safari tours with expert local guides.',
  canonical,
  image
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = canonical || siteUrl
  const img = image || `${siteUrl}/og-image.jpg`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  )
}

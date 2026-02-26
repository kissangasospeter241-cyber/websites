import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Lightbox from '../../components/Lightbox'
import Image from 'next/image'
import Head from 'next/head'

const BookingForm = dynamic(() => import('../../components/BookingForm'), { ssr: false })

export default function Trip({ trip }) {
  if (!trip) return <div className="p-6">Trip not found</div>
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.summary,
    url: `${siteUrl}/trips/${trip.slug}`,
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: 'USD'
    },
    image: trip.images && trip.images.length ? trip.images.map(i => (i.url.startsWith('http') ? i.url : siteUrl + i.url)) : undefined,
    provider: trip.operator ? { '@type': 'Organization', name: trip.operator.name } : undefined
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <h1 className="text-3xl font-bold">{trip.title}</h1>
      <p className="text-gray-600 mt-2">{trip.summary}</p>
      <div className="mt-4">{trip.description}</div>
      <div className="mt-6">
        <strong>Price:</strong> ${trip.price} • <strong>Duration:</strong> {trip.duration} days
      </div>
      <ImagesAndActivities trip={trip} />

      <div className="mt-8">
        <BookingForm tripId={trip.id} />
      </div>
    </main>
  )
}

function ImagesAndActivities({ trip }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  return (
    <div className="mt-6">
      {trip.images && trip.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          {trip.images.map((img, idx) => (
            <div key={img.id} className="relative w-full h-36 rounded overflow-hidden cursor-pointer" onClick={() => setLightboxIndex(idx)}>
              <Image src={img.url} alt={img.alt || trip.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold">Activities</h2>
      <ul>
        {trip.activities.map((a) => (
          <li key={a.id}>{a.name} — {a.detail}</li>
        ))}
      </ul>

      {lightboxIndex >= 0 && <Lightbox images={trip.images} start={lightboxIndex} onClose={() => setLightboxIndex(-1)} />}
    </div>
  )
}

export async function getServerSideProps(context) {
  const prisma = new PrismaClient()
  const { slug } = context.params
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: { activities: true, destination: true, operator: true }
  })
  await prisma.$disconnect()
  if (!trip) return { props: { trip: null } }
  // serialize dates
  trip.startDate = trip.startDate ? trip.startDate.toISOString() : null
  return { props: { trip } }
}

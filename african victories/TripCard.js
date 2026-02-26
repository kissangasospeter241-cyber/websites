import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/TripCard.module.css'

export default function TripCard({ trip }) {
  return (
    <article className={styles.card}>
      {trip.images && trip.images[0] ? (
        <div className={styles.media}>
          <Image
            src={trip.images[0].url}
            alt={trip.images[0].alt || trip.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
      ) : null}

      <div className={styles.content}>
        <Link href={`/trips/${trip.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{trip.title}</h3>
        </Link>
        <p className={styles.summary}>{trip.summary}</p>
        <div className={styles.meta}>Price: ${trip.price} | {trip.duration} days</div>
        <Link href={`/trips/${trip.slug}`} className={styles.cta}>View Itinerary</Link>
      </div>
    </article>
  )
}

import useSWR from 'swr'
import { useRouter } from 'next/router'
import TripCard from '../components/TripCard'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Search() {
  const router = useRouter()
  const { q } = router.query
  const { data, error } = useSWR(() => `/api/trips?q=${encodeURIComponent(q || '')}`, fetcher)

  if (error) return <div className="p-6">Failed to load</div>
  if (!data) return <div className="p-6">Loading…</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search results for "{q}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  )
}

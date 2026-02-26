import Link from 'next/link'

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Explore Tanzania Tours</h1>
        <p className="text-gray-600 mt-2">Find curated trips across Tanzania — safaris, cultural visits, beach escapes.</p>
      </header>

      <section className="mb-8">
        <form action="/search" method="get" className="flex gap-2" role="search" aria-label="Search trips">
          <input name="q" aria-label="Search trips" placeholder="Search trips, e.g. 'Tarangire'" className="flex-1 border rounded px-3 py-2" />
          <button className="bg-blue-600 text-white px-4 rounded">Search</button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Trips</h2>
        <ul>
          <li className="mb-3">
            <Link href="/trips/tarangire-wildlife-safari" className="text-blue-600">Tarangire Wildlife Safari — 3 days</Link>
          </li>
          <li>
            <Link href="/trips/ngorongoro-day-trip" className="text-blue-600">Ngorongoro Crater Day Trip</Link>
          </li>
        </ul>
      </section>

      <footer className="mt-12 text-sm text-gray-500">Contact: info@africanvictory.tz</footer>
    </main>
  )
}

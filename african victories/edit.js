import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function EditTrip() {
  const router = useRouter()
  const { id } = router.query
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      const res = await fetch(`/api/admin/trips/${id}`)
      if (!res.ok) return alert('Failed to load')
      setTrip(await res.json())
    }
    load()
  }, [id])

  if (!trip) return <div className="p-6">Loading…</div>

  async function deleteImage(imageId) {
    if (!confirm('Delete this image?')) return
    const res = await fetch(`/api/admin/trips/${id}/images/${imageId}`, { method: 'DELETE' })
    if (res.ok) setTrip({ ...trip, images: trip.images.filter(i => i.id !== imageId) })
    else alert('Failed to delete')
  }

  async function updateImageAlt(imageId, alt) {
    const res = await fetch(`/api/admin/trips/${id}/images/${imageId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ alt }) })
    if (res.ok) {
      const updated = await res.json()
      setTrip({ ...trip, images: trip.images.map(i => i.id === updated.id ? updated : i) })
    } else alert('Failed')
  }

  async function moveImage(index, dir) {
    const imgs = [...trip.images]
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= imgs.length) return
    const tmp = imgs[newIndex]
    imgs[newIndex] = imgs[index]
    imgs[index] = tmp
    // update order locally
    imgs.forEach((img, idx) => img.order = idx)
    setTrip({ ...trip, images: imgs })
    // persist orders
    await Promise.all(imgs.map(img => fetch(`/api/admin/trips/${id}/images/${img.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: img.order }) })))
  }

  const [uploading, setUploading] = useState(false)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: form })
    setUploading(false)
    if (!res.ok) return alert('Upload failed')
    const data = await res.json()
    // persist image record
    const r2 = await fetch(`/api/admin/trips/${id}/images`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: data.url, publicId: data.publicId, provider: data.provider, alt: '' }) })
    if (r2.ok) {
      const img = await r2.json()
      setTrip({ ...trip, images: [...(trip.images || []), img] })
    } else alert('Failed to attach image')
  }

  async function save(e) {
    e.preventDefault()
    const res = await fetch(`/api/admin/trips/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(trip) })
    if (res.ok) router.push('/admin')
    else alert('Save failed')
  }

  async function remove() {
    if (!confirm('Delete this trip?')) return
    const res = await fetch(`/api/admin/trips/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin')
    else alert('Delete failed')
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Trip</h1>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={trip.title} onChange={e => setTrip({ ...trip, title: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Summary</label>
          <textarea value={trip.summary} onChange={e => setTrip({ ...trip, summary: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input value={trip.price} onChange={e => setTrip({ ...trip, price: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={remove} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </form>
      {trip.images && trip.images.length > 0 && (
        <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Images</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium">Upload image</label>
              <input type="file" onChange={handleFile} className="w-full" />
              {uploading && <div className="text-sm text-gray-600">Uploading…</div>}
            </div>
          <div className="space-y-3">
            {trip.images.map((img, idx) => (
              <div key={img.id} className="flex items-center gap-3 border rounded p-2">
                <div className="w-24 h-16 relative rounded overflow-hidden">
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <input value={img.alt || ''} onChange={e => setTrip({ ...trip, images: trip.images.map(i => i.id === img.id ? { ...i, alt: e.target.value } : i) })} className="w-full border rounded px-2 py-1 mb-1" placeholder="Alt text" />
                  <div className="text-sm text-gray-600">Provider: {img.provider || 'local'}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={() => moveImage(idx, -1)} className="px-2 py-1 bg-gray-100 rounded">↑</button>
                  <button type="button" onClick={() => moveImage(idx, 1)} className="px-2 py-1 bg-gray-100 rounded">↓</button>
                  <button type="button" onClick={() => updateImageAlt(img.id, img.alt || '')} className="px-2 py-1 bg-blue-600 text-white rounded">Save Alt</button>
                  <button type="button" onClick={() => deleteImage(img.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

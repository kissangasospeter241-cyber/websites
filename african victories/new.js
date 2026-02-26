import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function NewTrip() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [price, setPrice] = useState('')
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    const payload = { title, summary, price: Number(price), slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description: '', duration: 1 }
    if (uploadedUrls.length) payload.images = uploadedUrls
    const res = await fetch('/api/admin/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) router.push('/admin')
    else alert('Failed')
  }

  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState([])

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: form })
    setUploading(false)
    if (res.ok) {
      const data = await res.json()
      setUploadedUrls((s) => [...s, data])
    } else {
      alert('Upload failed')
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Trip</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Summary</label>
          <textarea value={summary} onChange={e => setSummary(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload image</label>
          <input type="file" onChange={handleFile} className="w-full" />
          {uploading && <div className="text-sm text-gray-600">Uploading…</div>}
          {uploadedUrls.length > 0 && (
            <div className="flex gap-2 mt-2">
              {uploadedUrls.map((u) => (
                <div key={u.url} className="w-16 h-16 relative rounded overflow-hidden">
                  <Image src={u.url} alt={u.alt || 'uploaded'} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </div>
      </form>
    </main>
  )
}

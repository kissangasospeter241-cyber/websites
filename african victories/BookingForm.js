import { useState } from 'react'

export default function BookingForm({ tripId }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [seats, setSeats] = useState(1)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tripId, name, email, phone, seats, message }) })
      if (res.ok) setStatus('done')
      else setStatus('error')
    } catch (e) {
      setStatus('error')
    }
  }

  if (status === 'done') return <div role="status" aria-live="polite" className="p-4 bg-green-50 border border-green-100 rounded">Thank you — your booking request was received.</div>

  return (
    <form onSubmit={submit} className="mt-6 space-y-3 max-w-md" aria-label="Booking form">
      <h2 className="text-lg font-semibold">Book this trip</h2>
      <div>
        <label className="block text-sm" htmlFor="booking-name">Name</label>
        <input id="booking-name" required value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm" htmlFor="booking-email">Email</label>
        <input id="booking-email" required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm" htmlFor="booking-phone">Phone</label>
        <input id="booking-phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm" htmlFor="booking-seats">Seats</label>
        <input id="booking-seats" type="number" min="1" value={seats} onChange={e => setSeats(Number(e.target.value))} className="w-24 border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm" htmlFor="booking-message">Message (optional)</label>
        <textarea id="booking-message" value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{status === 'loading' ? 'Sending…' : 'Send booking request'}</button>
        {status === 'error' && <div role="alert" className="text-red-600 mt-2">Failed to send. Please try again.</div>}
      </div>
    </form>
  )
}

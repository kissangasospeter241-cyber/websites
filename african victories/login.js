import { signToken, TOKEN_NAME } from '../../../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body || {}
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'
  if (!password || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' })

  const token = signToken({ role: 'admin' })
  const secure = process.env.NODE_ENV === 'production'
  res.setHeader('Set-Cookie', `${TOKEN_NAME}=${token}; HttpOnly; Path=/; Max-Age=${8 * 3600}; SameSite=Lax${secure ? '; Secure' : ''}`)
  res.status(200).json({ ok: true })
}

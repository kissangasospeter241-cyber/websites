import { getTokenFromReq, verifyToken } from '../../../../lib/auth'

export default function handler(req, res) {
  const token = getTokenFromReq(req)
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    const data = verifyToken(token)
    return res.status(200).json({ user: data })
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

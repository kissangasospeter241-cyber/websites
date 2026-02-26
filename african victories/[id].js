import { PrismaClient } from '@prisma/client'
import { getTokenFromReq, verifyToken } from '../../../../../lib/auth'

const prisma = new PrismaClient()

function requireAuth(req) {
  const token = getTokenFromReq(req)
  if (!token) throw new Error('unauth')
  verifyToken(token)
}

export default async function handler(req, res) {
  try {
    requireAuth(req)
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { id } = req.query
  if (req.method === 'GET') {
    const trip = await prisma.trip.findUnique({ where: { id: Number(id) }, include: { activities: true, images: true } })
    return res.status(200).json(trip)
  }

  if (req.method === 'PUT') {
    const payload = req.body
    const updated = await prisma.trip.update({ where: { id: Number(id) }, data: payload })
    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.activity.deleteMany({ where: { tripId: Number(id) } })
    await prisma.trip.delete({ where: { id: Number(id) } })
    return res.status(204).end()
  }

  res.status(405).end()
}

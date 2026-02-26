import { PrismaClient } from '@prisma/client'
import { getTokenFromReq, verifyToken } from '../../../../../lib/auth'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

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

  const { id, imageId } = req.query
  if (req.method === 'DELETE') {
    try {
      const img = await prisma.tripImage.findUnique({ where: { id: Number(imageId) } })
      if (!img) return res.status(404).json({ error: 'Not found' })

      // delete asset from local disk when provider=local
      if (img.provider === 'local' && img.url && img.url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', img.url.replace(/^\//, ''))
        try { await fs.promises.unlink(filePath) } catch (e) {}
      }

      // delete from cloudinary if publicId present
      if (img.publicId && cloudinary) {
        try { await cloudinary.uploader.destroy(img.publicId) } catch (e) {}
      }

      await prisma.tripImage.delete({ where: { id: Number(imageId) } })
      return res.status(204).end()
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  if (req.method === 'PUT') {
    // update alt or order
    const body = req.body || {}
    try {
      const updated = await prisma.tripImage.update({ where: { id: Number(imageId) }, data: body })
      return res.status(200).json(updated)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  res.setHeader('Allow', 'GET,DELETE,PUT')
  res.status(405).end()
}

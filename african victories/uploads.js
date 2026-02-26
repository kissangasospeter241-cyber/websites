import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

export const config = { api: { bodyParser: false } }

const uploadDir = path.join(process.cwd(), 'public', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

async function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder: 'tanzania_tours' }, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const form = new formidable.IncomingForm({ keepExtensions: true })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Upload error' })
    }
    const file = files.file || files.image || Object.values(files)[0]
    if (!file) return res.status(400).json({ error: 'No file' })

    const tempPath = file.filepath || file.path

    // If Cloudinary is configured, upload there and return secure URL + public_id
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const result = await uploadToCloudinary(tempPath)
        // remove temp file
        try { await fs.promises.unlink(tempPath) } catch (e) {}
        return res.status(200).json({ url: result.secure_url, publicId: result.public_id, provider: 'cloudinary' })
      } catch (e) {
        console.error('Cloudinary upload failed', e)
        // fall back to local
      }
    }

    // Fallback: store locally
    const filename = `${Date.now()}-${file.originalFilename || file.name}`.replace(/\s+/g, '-')
    const dest = path.join(uploadDir, filename)
    try {
      await fs.promises.rename(tempPath, dest)
    } catch (e) {
      await fs.promises.copyFile(tempPath, dest)
      try { await fs.promises.unlink(tempPath) } catch (e) {}
    }
    const url = `/uploads/${filename}`
    res.status(200).json({ url, provider: 'local' })
  })
}

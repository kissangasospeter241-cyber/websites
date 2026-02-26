/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'sw'],
    defaultLocale: 'en'
  }
}

module.exports = nextConfig

// Allow loading images from Cloudinary and localhost (for uploaded assets)
module.exports.images = {
  remotePatterns: [
    { protocol: 'https', hostname: '**.cloudinary.com', port: '', pathname: '/**' },
    { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/uploads/**' }
  ]
}

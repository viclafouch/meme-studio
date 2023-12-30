const withNextIntl = require('next-intl/plugin')(
  // Specify a custom path here
  './src/i18n/index.ts'
)

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  reactStrictMode: true
}

module.exports = withMDX(withNextIntl(nextConfig))

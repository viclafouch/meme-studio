const withNextIntl = require('next-intl/plugin')(
  // Specify a custom path here
  './src/i18n/index.ts'
);

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
      },
    ],
  },
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.meme-studio.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    styledComponents: true
  },
  reactStrictMode: true,
}

module.exports = nextConfig

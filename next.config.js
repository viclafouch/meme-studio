/* eslint-disable @typescript-eslint/no-require-imports */
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/index.ts')

const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = withMDX(withNextIntl(nextConfig))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPEN_EXCHANGES_KEY: process.env.OPEN_EXCHANGES_KEY
  }
}

module.exports = nextConfig

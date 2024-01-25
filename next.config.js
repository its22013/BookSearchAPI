/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  env: {
    APP_ID: process.env.APP_ID,
  },
  images: {
    domains: ['thumbnail.image.rakuten.co.jp'],
  },
};

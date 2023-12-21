/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    APP_ID: process.env.APP_ID,
  },
};

module.exports = nextConfig
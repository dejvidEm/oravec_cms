/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: ""
      }
    ]
  }
}

export default nextConfig

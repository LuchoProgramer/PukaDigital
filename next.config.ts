import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // 1. Remove Language Prefixes (SEO CLEANUP)
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
      {
        source: '/es/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/pt',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pt/:path*',
        destination: '/:path*',
        permanent: true,
      },

      // 2. Legacy Product Paths → New Optimized Landings
      {
        source: '/chatbot',
        destination: '/chatbot-ia-whatsapp',
        permanent: true,
      },
      {
        source: '/sistema',
        destination: '/sistema-erp-cloud',
        permanent: true,
      },
      {
        source: '/inventario',
        destination: '/sistema-erp-cloud',
        permanent: true,
      },
      {
        source: '/salud',
        destination: '/historias-clinicas',
        permanent: false, // Temporary for now if unsure of final naming
      },
    ]
  },
};

export default nextConfig;

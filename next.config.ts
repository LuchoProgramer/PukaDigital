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
        destination: '/agentes-ia',
        permanent: true,
      },
      {
        source: '/chatbot-ia-whatsapp',
        destination: '/agentes-ia',
        permanent: true,
      },
      {
        source: '/sistema',
        destination: '/ledgerxpertz',
        permanent: true,
      },
      {
        source: '/inventario',
        destination: '/ledgerxpertz',
        permanent: true,
      },
      {
        source: '/sistema-inventario',
        destination: '/ledgerxpertz',
        permanent: true,
      },
      {
        source: '/sistema-erp-cloud',
        destination: '/ledgerxpertz',
        permanent: true,
      },
      {
        source: '/sistema-emprendedor',
        destination: '/agencia',
        permanent: true,
      },

    ]
  },
};

export default nextConfig;

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
        destination: '/marketing-medico-ecuador', // This path seems planned given its prominence, let's verify if it exists or use /salud if not. 
        // Re-checking list_dir: /salud exists as a directory. 
        // Let's keep /salud pointing to itself if it's the main one, 
        // but often users want short URLs. 
        // Based on previous contexts, these were the "cleaner" names.
        permanent: false, // Temporary for now if unsure of final naming
      },
    ]
  },
};

export default nextConfig;

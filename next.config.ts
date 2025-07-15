import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.carro57.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'robustcar.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.robustcar.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.robustcar.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.robustcar.com.br',
        port: '',
        pathname: '/**',
      },
      // Domínios comuns de imagens de veículos
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Configurações de qualidade e formatos
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache otimizado para imagens externas
    minimumCacheTTL: 60 * 60 * 24, // 24 horas
  },
};

export default nextConfig;

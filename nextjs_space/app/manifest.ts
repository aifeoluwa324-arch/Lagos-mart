import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lagos Mart Stock Management System',
    short_name: 'Lagos Mart',
    description: 'Stock Management System for Lagos Mart Supermarket, Ikeja, Lagos',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f7fa',
    theme_color: '#1a5fb4',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}

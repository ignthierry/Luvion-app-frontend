import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Jangan indeks halaman internal/dashboard dan API
    },
    sitemap: 'https://luvion.my.id/sitemap.xml',
  }
}

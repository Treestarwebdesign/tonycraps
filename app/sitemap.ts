import type { MetadataRoute } from 'next';
import { portfolioEntries, SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/projecten/', '/contact/', ...portfolioEntries.map((p) => `/portfolio/${p.slug}/`)];
  return pages.map((p) => ({ url: `${SITE.url}${p}` }));
}

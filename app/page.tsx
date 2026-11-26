import type { Metadata } from 'next';
import Slideshow from '@/components/Slideshow';
import { featured, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: SITE.name },
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <Slideshow
      slides={featured.map((f) => ({
        image: f.image,
        alt: f.caption,
        href: `/portfolio/${f.slug}/`,
        caption: {
          sub: SITE.name,
          title: f.caption,
          button: { href: '/projecten/', label: 'Bekijk projecten' },
        },
      }))}
    />
  );
}

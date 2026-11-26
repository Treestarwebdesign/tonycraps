import type { Metadata, Viewport } from 'next';
import { PT_Sans } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { SITE } from '@/lib/site';
import './globals.css';

const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pt' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: SITE.name, locale: 'nl_BE', type: 'website' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phoneHref,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    postalCode: '2450',
    addressLocality: 'Meerhout',
    addressCountry: 'BE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-BE" className={ptSans.variable}>
      <body>
        <Sidebar />
        <main className="mainbody">{children}</main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}

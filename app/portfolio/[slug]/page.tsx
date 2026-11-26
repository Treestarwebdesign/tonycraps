import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Slideshow from '@/components/Slideshow';
import ProjectInfo from '@/components/ProjectInfo';
import { portfolioEntries } from '@/lib/site';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return portfolioEntries.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = portfolioEntries.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description || `${p.title}: project van Tony Craps Architectenbureau, Meerhout.`,
    alternates: { canonical: `/portfolio/${p.slug}/` },
    openGraph: { images: [p.images[0]] },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = portfolioEntries.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <Slideshow
      dots
      slides={p.images.map((src, i) => ({ image: src, alt: `${p.title}${p.description ? ` – ${p.description}` : ''} (foto ${i + 1})` }))}
    >
      <ProjectInfo title={p.title} description={p.description} />
    </Slideshow>
  );
}

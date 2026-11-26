import type { Metadata } from 'next';
import PortfolioGrid from '@/components/PortfolioGrid';
import { projects } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Projecten',
  description:
    'Realisaties van Tony Craps Architectenbureau: hedendaagse woningen, klassieke woningbouw, verbouwingen en industriebouw.',
  alternates: { canonical: '/projecten/' },
};

export default function Projecten() {
  return (
    <div className="page" style={{ backgroundImage: 'url(/wp-content/uploads/2012/06/projecten.jpg)' }}>
      <div className="lines" aria-hidden />
      <div className="contentarea">
        <div className="pagename">
          <h1>
            <span>Projecten</span>
          </h1>
        </div>
        <PortfolioGrid projects={projects} />
      </div>
    </div>
  );
}

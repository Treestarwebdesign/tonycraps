'use client';

import Link from 'next/link';
import { useState } from 'react';

/** Het "+ More Info" paneel van de oude projectpagina's. */
export default function ProjectInfo({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`projectinfo${open ? ' open' : ''}`}>
      <button className="toggleproject" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">Meer info</span>
      </button>
      <span className="tooltip">{open ? 'Sluiten' : 'Meer info'}</span>
      <div className="projectcontent" hidden={!open}>
        <div className="pagename">
          <h1>
            <span>{title}</span>
          </h1>
        </div>
        <div className="contentwrap">
          {description && <p>{description}</p>}
          <p className="back">
              <Link href="/projecten/">← Alle projecten</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

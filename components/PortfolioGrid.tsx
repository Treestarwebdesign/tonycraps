'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES, categoryLabel, type Category, type Project } from '@/lib/site';

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Category | '*'>('*');
  const visible = filter === '*' ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <div className="filterwrap">
        <ul className="filter">
          <li>
            <button className={filter === '*' ? 'active' : undefined} onClick={() => setFilter('*')}>
              Alle
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <button
                className={filter === c.key ? 'active' : undefined}
                onClick={() => setFilter(c.key)}
                title={`Bekijk alle projecten in ${c.label}`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="portfoliocontainer">
        {visible.map((p) => (
          <article key={p.slug} className="portfoliothumb">
            <Link href={`/portfolio/${p.slug}/`} className="portfolioitem">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0]} alt={p.description || p.title} loading="lazy" />
            </Link>
            <h2>
              <Link href={`/portfolio/${p.slug}/`}>{p.title}</Link>
            </h2>
            <p>
              <button className="filtersort" onClick={() => setFilter(p.category)}>
                {categoryLabel(p.category)}
              </button>
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

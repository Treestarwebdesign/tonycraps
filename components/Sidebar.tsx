'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SITE } from '@/lib/site';

const MENU = [
  { href: '/', label: 'Home' },
  { href: '/projecten/', label: 'Projecten' },
  { href: '/contact/', label: 'Contact' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href) || (href === '/projecten/' && pathname.startsWith('/portfolio/'));

  return (
    <header className={`navcontainer${open ? ' open' : ''}`}>
      <div className="logo">
        <Link href="/" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt={SITE.name} width={180} height={43} />
        </Link>
      </div>
      <button
        className="menutoggle"
        aria-expanded={open}
        aria-controls="hoofdmenu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sr-only">Menu</span>
        <span aria-hidden>☰</span>
      </button>
      <nav id="hoofdmenu" className="nav" aria-label="Hoofdmenu">
        <ul>
          {MENU.map((m) => (
            <li key={m.href} className={isActive(m.href) ? 'current' : undefined}>
              <Link href={m.href} onClick={() => setOpen(false)}>
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

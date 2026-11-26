'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Slide = {
  image: string;
  alt: string;
  href?: string;
  caption?: { sub: string; title: string; button?: { href: string; label: string } };
};

type Props = {
  slides: Slide[];
  interval?: number;
  autoplay?: boolean;
  /** Toon de kleine bolletjes rechtsboven (zoals op de projectpagina's) */
  dots?: boolean;
  children?: React.ReactNode;
};

/** Fullscreen achtergrondslideshow met fade, vervanger van de "Supersized" jQuery-plugin van het oude thema. */
export default function Slideshow({ slides, interval = 5000, autoplay = true, dots = false, children }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoplay && slides.length > 1);
  const [tick, setTick] = useState(0);
  const count = slides.length;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (n: number) => {
      setIndex(((n % count) + count) % count);
      setTick((t) => t + 1);
    },
    [count],
  );

  useEffect(() => {
    if (!playing || count < 2) return;
    timer.current = setTimeout(() => go(index + 1), interval);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, playing, interval, go, count, tick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const current = slides[index];

  return (
    <div className="slideshow">
      <ul className="slides" aria-live="polite">
        {slides.map((s, i) => {
          // eslint-disable-next-line @next/next/no-img-element
          const img = <img src={s.image} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />;
          return (
            <li key={s.image + i} className={i === index ? 'active' : undefined} aria-hidden={i !== index}>
              {s.href ? (
                <Link href={s.href} tabIndex={i === index ? 0 : -1}>
                  {img}
                </Link>
              ) : (
                img
              )}
            </li>
          );
        })}
      </ul>
      <div className="lines" aria-hidden />

      {current.caption && (
        <div className="captioncontainer">
          <div className="caption" key={index}>
            <div className="subheadline">
              <span>{current.caption.sub}</span>
            </div>
            <div className="bgwrap">
              <h2>
                <strong>{current.caption.title}</strong>
              </h2>
            </div>
            {current.caption.button && (
              <div className="captionbutton">
                <Link href={current.caption.button.href} className="button">
                  {current.caption.button.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {children}

      {count > 1 && (
        <>
          <button className="arrow prev" onClick={() => go(index - 1)} aria-label="Vorige foto" />
          <button className="arrow next" onClick={() => go(index + 1)} aria-label="Volgende foto" />
          <div className="controls">
            <span className="slidecounter">
              {index + 1} / {count}
            </span>
            <button
              className={`playpause ${playing ? 'is-playing' : ''}`}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pauzeer slideshow' : 'Start slideshow'}
            />
          </div>
          {dots && (
            <ul className="slide-list">
              {slides.map((_, i) => (
                <li key={i} className={i === index ? 'current' : undefined}>
                  <button onClick={() => go(i)} aria-label={`Foto ${i + 1}`} />
                </li>
              ))}
            </ul>
          )}
          {playing && <div className="progress" key={`${index}-${tick}`} style={{ animationDuration: `${interval}ms` }} />}
        </>
      )}
    </div>
  );
}

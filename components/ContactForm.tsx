'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * Statisch contactformulier.
 * - Met NEXT_PUBLIC_FORM_ENDPOINT (bv. https://formspree.io/f/xxxxxxx) wordt het bericht via die dienst gemaild.
 * - Zonder endpoint opent het formulier het mailprogramma van de bezoeker (mailto-fallback).
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || '';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // spam-honeypot

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Contact via website: ${data.get('name')}`);
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`);
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return <p className="formmessage ok">Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.</p>;
  }

  return (
    <form className="contactform" onSubmit={onSubmit}>
      <div className="formrow">
        <div>
          <label htmlFor="c_name">Naam</label>
          <input type="text" name="name" id="c_name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="c_email">E-mail</label>
          <input type="email" name="email" id="c_email" required autoComplete="email" />
        </div>
      </div>
      <label htmlFor="c_message">Bericht</label>
      <textarea name="message" id="c_message" rows={8} required />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <input type="hidden" name="_subject" value="Nieuw bericht via tonycraps.be" />
      <button type="submit" className="button dark" disabled={status === 'sending'}>
        {status === 'sending' ? 'Versturen…' : 'Verstuur bericht'}
      </button>
      {status === 'error' && (
        <p className="formmessage error">
          Er ging iets mis bij het versturen. Mail ons rechtstreeks op <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      )}
    </form>
  );
}

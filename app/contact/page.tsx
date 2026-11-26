import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contacteer ${SITE.name}, ${SITE.address.street}, ${SITE.address.city}. Tel. ${SITE.phone}.`,
  alternates: { canonical: '/contact/' },
};

export default function Contact() {
  return (
    <div className="page" style={{ backgroundImage: 'url(/wp-content/uploads/2012/06/links.jpg)' }}>
      <div className="lines" aria-hidden />
      <div className="contentarea">
        <div className="pagename">
          <h1>
            <span>Contact</span>
          </h1>
        </div>
        <div className="smallpage pagebg">
          <h2 className="h3">{SITE.name}</h2>
          <address>
            {SITE.address.street}
            <br />
            {SITE.address.city}
            <br />
            <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
            <br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </address>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

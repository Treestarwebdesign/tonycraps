import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page" style={{ backgroundImage: 'url(/wp-content/uploads/2012/06/projecten.jpg)' }}>
      <div className="lines" aria-hidden />
      <div className="contentarea">
        <div className="pagename">
          <h1>
            <span>Pagina niet gevonden</span>
          </h1>
        </div>
        <div className="smallpage pagebg">
          <p>Deze pagina bestaat niet (meer).</p>
          <p>
            <Link href="/projecten/">Bekijk onze projecten</Link> of ga terug naar de <Link href="/">homepage</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

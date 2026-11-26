// Downloadt alle foto's van de huidige WordPress-site naar /public, met dezelfde paden
// (/wp-content/uploads/...). Zo blijven oude afbeeldings-URL's (Google Afbeeldingen, links) werken.
// Gebruik:  npm run fetch-images      (eenmalig, zolang de oude site nog online is)
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.SOURCE_URL || 'https://www.tonycraps.be';
const list = JSON.parse(await readFile(join(ROOT, 'scripts/images.json'), 'utf8'));

const jobs = [
  ...list.map((p) => [p, p]),
  ['/mobile/wp-content/uploads/2012/06/Schermafbeelding-2013-01-22-om-18.19.06.png', '/images/logo.png'],
  ['/favicon.ico', '/favicon.ico'],
];

let ok = 0, skipped = 0, failed = 0;
const exists = (f) => access(f).then(() => true, () => false);

async function get([from, to]) {
  const dest = join(ROOT, 'public', to);
  if (await exists(dest)) { skipped++; return; }
  try {
    const res = await fetch(SRC + from);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (e) {
    failed++;
    console.error(`✗ ${from}: ${e.message}`);
  }
}

// 6 tegelijk, de oude server niet overbelasten
for (let i = 0; i < jobs.length; i += 6) await Promise.all(jobs.slice(i, i + 6).map(get));
console.log(`Klaar: ${ok} gedownload, ${skipped} al aanwezig, ${failed} mislukt (van ${jobs.length}).`);
if (failed) process.exit(1);

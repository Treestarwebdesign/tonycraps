# tonycraps.be – statische site (Next.js)

Vervanging van de oude WordPress 4.2-site door een volledig statische site.
Na de build is het pure HTML/CSS/JS in de map `out/`: geen PHP, geen database, geen server-runtime.

## Structuur

| URL | Bestand |
| --- | --- |
| `/` | `app/page.tsx` – fullscreen slideshow met de 4 categorieën |
| `/projecten/` | `app/projecten/page.tsx` – raster van 36 projecten met filter |
| `/portfolio/<slug>/` | `app/portfolio/[slug]/page.tsx` – fullscreen foto's per project + "Meer info" |
| `/contact/` | `app/contact/page.tsx` – adres, telefoon en e-mail (geen formulier) |

Alle inhoud (titels, omschrijvingen, foto's) staat in **`lib/content.json`**.
Een project toevoegen = een blok toevoegen in dat bestand + de foto's in `public/wp-content/uploads/...` zetten.
Adres, telefoon en e-mail staan in `lib/site.ts`.

De oude URL's zijn behouden (zelfde slugs, met afsluitende slash), ook de foto-URL's (`/wp-content/uploads/...`).

## Eerste keer opzetten

```bash
npm install
npm run fetch-images   # downloadt de 170 foto's + logo van de huidige site naar public/
npm run dev            # lokaal bekijken op http://localhost:3000
```

`fetch-images` moet gebeuren **zolang de oude WordPress-site nog online is**. Daarna staan de foto's in het project zelf.

## Bouwen

```bash
npm run build        # resultaat in out/
npm run preview      # out/ lokaal testen op http://localhost:4000
```

## Deployen op Cloudways

### Via Git (aanbevolen)

Bij elke push naar `main` bouwt GitHub Actions de site en zet de inhoud van `out/` (incl. `.htaccess`)
op de branch **`deploy`** (workflow `.github/workflows/deploy-branch.yml`).

Eenmalig instellen in Cloudways → Application → *Deployment via GIT*:
1. Kopieer de gegenereerde publieke sleutel (*View SSH Keys*) en voeg die in GitHub toe onder
   repo → Settings → Deploy keys (alleen lezen).
2. GIT Remote Address: `git@github.com:Treestarwebdesign/tonycraps.git` → *Authenticate*.
3. Branch: `deploy`, Deployment Path: `public_html/` → *Start deployment*.

Daarna: wijziging naar `main` pushen, wachten tot de workflow klaar is, en in Cloudways op *Pull* klikken.


### Alternatief: deploy-script (SSH + rsync)

1. Kopieer `.deploy.env.example` naar `.deploy.env` en vul `DEPLOY_APP` in (de map-id van de app onder `~/applications/`).
2. `npm run deploy -- --dry-run` toont wat er zou veranderen.
3. `npm run deploy` bouwt de site en zet `out/` (inclusief `.htaccess`) in `public_html`.
   Bestanden die niet in `out/` staan worden op de server verwijderd.

### Manueel

1. Maak in Cloudways een applicatie aan van het type **PHP (Custom App)** – dat geeft een kale Apache/Nginx-webroot
   (er draait geen PHP-code, het is enkel de webserver).
2. Upload de **inhoud** van `out/` naar `public_html/` van die applicatie, via SFTP (Application Credentials) of:
   ```bash
   rsync -avz --delete out/ <sftp-user>@<server-ip>:~/applications/<app-map>/public_html/
   ```
   Let op dat het verborgen bestand **`.htaccess`** mee gaat.
3. Koppel het domein `www.tonycraps.be` (+ `tonycraps.be`) bij *Domain Management* en activeer **Let's Encrypt SSL**.
4. Zet DNS van het domein naar het IP van de Cloudways-server.
5. Controleer: `https://www.tonycraps.be/`, `/projecten/`, `/portfolio/h1/`, een oude URL zoals `/mobile/projecten/`
   (moet 301 naar `/projecten/`) en `/wp-login.php` (moet 410 geven).
6. Dien `https://www.tonycraps.be/sitemap.xml` in bij Google Search Console.

> Cloudways gebruikt Nginx vóór Apache; `.htaccess` wordt door Apache gewoon gelezen.
> Elke andere statische host (Netlify, Cloudflare Pages, Vercel, gewone Apache-hosting) werkt ook: upload `out/`.

## .htaccess (`public/.htaccess`, komt automatisch in `out/`)

- forceert `https://www.`
- 301-redirects van oude WordPress-URL's (`/mobile/...`, `/projecten/page/2/`, feeds, datumarchieven, `?p=`)
- `410 Gone` voor `wp-admin`, `wp-login.php`, `xmlrpc.php` en alle `.php`
- beveiligingsheaders, caching en gzip
- eigen 404-pagina

## Wat bewust anders is dan op de oude site

- Geen contactformulier meer: de contactpagina toont adres, klikbaar telefoonnummer en e-mailadres.
- Commentaarformulieren onder projecten, zoekvak en sociale deelknoppen zijn weggelaten.
- Google Analytics (oude `UA-`-code werkt sinds 2023 niet meer) is weggelaten; voeg indien gewenst GA4 of Plausible toe in `app/layout.tsx`.
- Lettertype PT Sans wordt zelf gehost (geen verbinding met Google Fonts, beter voor GDPR).
- Meta descriptions en Schema.org-gegevens (adres, telefoon) toegevoegd voor SEO; de oude site had er geen.

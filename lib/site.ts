import content from './content.json';

export const SITE = {
  name: 'Tony Craps: Architectenbureau',
  url: 'https://www.tonycraps.be',
  description:
    'Tony Craps Architectenbureau in Meerhout: hedendaagse architectuur, klassieke woningbouw, verbouwingen en industriebouw.',
  address: { street: 'Heikant 69', city: '2450 Meerhout', country: 'BE' },
  phone: '+32 (0)14/30.19.04',
  phoneHref: '+3214301904',
  email: 'info@tonycraps.be',
};

export type Category = 'hedendaags' | 'industriebouw' | 'klassiek' | 'verbouwingen';

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'hedendaags', label: 'Hedendaags' },
  { key: 'industriebouw', label: 'Industriebouw' },
  { key: 'klassiek', label: 'Klassiek' },
  { key: 'verbouwingen', label: 'Verbouwingen' },
];

export type Project = {
  slug: string;
  title: string;
  category: Category;
  description: string;
  images: string[];
};

export type Featured = {
  slug: string;
  title: string;
  caption: string;
  image: string;
  thumb: string;
};

export const projects = content.projects as Project[];
export const featured = content.featured as Featured[];

export const categoryLabel = (c: Category) =>
  CATEGORIES.find((x) => x.key === c)?.label ?? c;

/** Alle /portfolio/<slug>/ pagina's: de 36 projecten + de 4 uitgelichte categorie-items van de homepage. */
export type PortfolioEntry = { slug: string; title: string; description: string; images: string[] };

export const portfolioEntries: PortfolioEntry[] = [
  ...projects.map((p) => ({ slug: p.slug, title: p.title, description: p.description, images: p.images })),
  ...featured.map((f) => ({ slug: f.slug, title: f.title, description: '', images: [f.image] })),
];

export const SITE_URL = 'https://whatsthetime.top';
export const SITE_NAME = "What's The Time";
export const SITE_AUTHOR = 'Kusal Darshana';
export const DEFAULT_IMAGE = '/og-preview.png';

export const DEFAULT_KEYWORDS = [
  'time zone converter',
  'world clock',
  'meeting planner',
  'time zone meeting planner',
  'international meeting scheduler',
  'current time',
  'what time is it',
  'time difference calculator',
  'global time converter',
  'daylight saving time',
].join(', ');

const withTrailingSlash = (path) =>
  path.endsWith('/') || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`;

export const absoluteUrl = (path = '/') => new URL(withTrailingSlash(path), SITE_URL).href;

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/web-app-manifest-512x512.png'),
  },
  sameAs: [
    'https://github.com/thekusaldarshana/whatsthetime',
    'https://www.x.com/KusalDarshana75',
    'https://www.linkedin.com/in/kusaldarshana',
    'https://whatsthetime.hashnode.dev',
  ],
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/popular?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const breadcrumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqPage = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

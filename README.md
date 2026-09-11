# What's The Time

A fast, modern global time zone converter, world clock and international meeting planner.
Live at **[whatsthetime.top](https://whatsthetime.top)**.

- Convert a time between any two cities, with daylight saving handled through the IANA time zone database
- Live world clock cards and shareable comparison pages such as `/tokyo-vs-new-york`
- Meeting planner that lines up working hours across participants
- Embeddable converter and meeting planner widgets
- Blog on time zones, remote work and scheduling

## Tech stack

- [Astro](https://astro.build) 5 (static output) with React islands
- Tailwind CSS
- Luxon / date-fns-tz for time zone maths
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static build into dist/
npm run preview  # serve the production build
```

## Project structure

```
src/
  components/   UI components (TimeConverter, MeetingPlanner, AdUnit, Seo, ...)
  content/blog/ Markdown blog posts (Astro content collection)
  layouts/      Layout.astro — shared head, header, footer
  lib/          site metadata + structured data helpers, ad slots, city data
  pages/        routes, including the generated [from]-vs-[to] comparison pages
public/         static assets, robots.txt, ads.txt, llms.txt
```

SEO metadata and JSON-LD live in `src/components/Seo.astro` and `src/lib/site.js`; ad
placements go through `src/components/AdSense.astro` (one loader per page) and
`src/components/AdUnit.astro`.

## Ads

The deployed site runs Google AdSense, configured entirely through one environment variable:

```bash
cp .env.example .env
# PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
```

When `PUBLIC_ADSENSE_CLIENT` is empty — the default for forks and local development — no
AdSense script, account meta tag or ad slot is rendered. Use your own publisher ID; serving
ads under someone else's violates the AdSense program policies. Slot IDs live in
`src/lib/ads.js` and `public/ads.txt` must list your own seller line.

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md). To report a security issue, see [SECURITY.md](SECURITY.md).

## License

Code is licensed under the [MIT License](LICENSE).
Blog posts in `src/content/blog/` and site imagery are © Kusal Darshana and are not covered
by the MIT license; please ask before republishing them.

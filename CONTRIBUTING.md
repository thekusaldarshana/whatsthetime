# Contributing

Thanks for taking the time to contribute to What's The Time.

## Getting set up

```bash
npm install
npm run dev
```

Then open http://localhost:4321. `npm run build` must succeed before a pull request is merged.

## Pull requests

1. Fork the repo and create a branch from `main`.
2. Keep changes focused — one topic per pull request.
3. Match the existing style: Astro components, Tailwind utility classes, no new dependencies
   unless there is no reasonable alternative.
4. Run `npm run build` and check the affected pages in `npm run preview`.
5. Describe what changed and why in the pull request body.

## Things to keep in mind

- **Ads:** every page loads the AdSense script exactly once through
  `src/components/AdSense.astro`. Add placements with `<AdUnit slot={...} />` rather than
  pasting AdSense snippets into pages or blog posts.
- **SEO:** page metadata goes through `<Seo />` / `Layout.astro`. Do not hand-write `<title>`,
  canonical or Open Graph tags in a page.
- **URLs:** the canonical domain is `https://whatsthetime.top`. Build absolute URLs with
  `absoluteUrl()` from `src/lib/site.js`.
- **Time logic:** always resolve cities through IANA time zone identifiers so daylight saving
  is handled automatically. Never hard-code UTC offsets.

## Adding a blog post

Add a Markdown file to `src/content/blog/` with `title`, `description`, `pubDate`, `tags` and
`image` front matter. Posts are rendered by `src/pages/blog/[slug].astro`, which generates the
metadata and structured data for you.

## Reporting bugs

Open an issue with the page URL, what you expected, what happened, and your browser and time
zone — time zone bugs are often specific to a region or a DST transition date.

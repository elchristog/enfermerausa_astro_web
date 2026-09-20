import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { legacyRedirects } from './src/data/legacy-redirects.mjs';

// Build Astro redirects map (with and without trailing slash)
const redirects = Object.fromEntries(
  Object.entries(legacyRedirects).flatMap(([from, to]) => [
    [`/${from}`, to],
    [`/${from}/`, to],
  ])
);

export default defineConfig({
  site: 'https://enfermerausa.com',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "github-dark",
    }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  integrations: [ sitemap({
    filter: (page) => !Object.keys(legacyRedirects).some((slug) => page.includes(`/${slug}`)),
  }), mdx()],
  redirects,
});

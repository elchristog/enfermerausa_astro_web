import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { legacyRedirects } from './src/data/legacy-redirects.mjs';

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
    // Keep legacy redirect shells out of the sitemap, but keep real pages
    // that only map to themselves (e.g. /validar-enfermeria-en-usa/ → itself).
    filter: (page) => !Object.entries(legacyRedirects).some(([slug, target]) => {
      const selfPath = `/${slug}/`;
      if (target === selfPath) return false; // real page, not a shell
      return page.includes(selfPath) || page.endsWith(`/${slug}`);
    }),
  }), mdx()],
});

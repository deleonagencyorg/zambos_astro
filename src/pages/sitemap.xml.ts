import type { APIRoute } from 'astro';
import { routesConfig } from '../config/routes';

const BASE = 'https://zambos.com';
const TODAY = new Date().toISOString().split('T')[0];

/**
 * Build a <url> entry with optional hreflang alternates.
 * esUrl / enUrl are full absolute URLs.
 */
function urlEntry(
  loc: string,
  opts: { esUrl?: string; enUrl?: string; priority?: string } = {}
): string {
  const { esUrl, enUrl, priority = '0.8' } = opts;
  const alts: string[] = [];
  if (esUrl) alts.push(`<xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>`);
  if (enUrl) alts.push(`<xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`);
  // x-default points to the ES (primary) version when bilingual, otherwise to itself
  const xDefault = esUrl || loc;
  if (esUrl && enUrl) alts.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/>`);

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    ${alts.join('\n    ')}
  </url>`;
}

export const GET: APIRoute = async () => {
  const entries: string[] = [];

  // ── Home pages ──────────────────────────────────────────────────────────────
  const esHome = `${BASE}/es`;
  const usHome = `${BASE}/us`;
  entries.push(urlEntry(esHome, { esUrl: esHome, enUrl: usHome, priority: '1.0' }));
  entries.push(urlEntry(usHome, { esUrl: esHome, enUrl: usHome, priority: '1.0' }));

  // ── All routes from routesConfig ────────────────────────────────────────────
  for (const route of routesConfig) {
    if (route.id === 'home') continue;

    const esSlug = route.slugs['es'];
    const usSlug = route.slugs['us'];
    const esUrl = esSlug ? `${BASE}/es/${esSlug}` : undefined;
    const usUrl = usSlug ? `${BASE}/us/${usSlug}` : undefined;

    // Emit one entry per language variant that exists
    if (esUrl) {
      entries.push(urlEntry(esUrl, { esUrl, enUrl: usUrl }));
    }
    if (usUrl) {
      entries.push(urlEntry(usUrl, { esUrl, enUrl: usUrl }));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

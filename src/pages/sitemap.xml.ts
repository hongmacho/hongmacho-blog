import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');

  // Build base site URL
  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://hongmacho.dev';

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0 },
    { path: 'blog', priority: 1.0 },
    { path: 'about', priority: 0.7 },
  ];

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Generate sitemap entries for static pages
  const staticEntries = staticPages
    .map((page) => {
      const url = page.path ? `${siteUrl}/${page.path}` : siteUrl;
      return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  // Generate sitemap entries for blog posts
  const postEntries = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.id}`;
      const postDate = post.data.date;
      return `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <lastmod>${postDate}</lastmod>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n');

  // Build sitemap XML
  const sitemapBody = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

  return new Response(sitemapBody, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

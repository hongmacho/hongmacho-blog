import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');

  // Sort by date descending
  posts.sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });

  // Build channel link
  const siteUrl = context.site?.toString().replace(/\/$/, '') || 'https://hongmacho.dev';
  const channelLink = `${siteUrl}/blog`;
  const lastBuildDate = new Date().toUTCString();

  // Build RSS items
  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.id}`;
      const pubDate = new Date(post.data.date).toUTCString();
      const categories = post.data.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join('\n');

      return `  <item>
    <title>${escapeXml(post.data.title)}</title>
    <link>${postUrl}</link>
    <description>${escapeXml(post.data.excerpt)}</description>
    <pubDate>${pubDate}</pubDate>
${categories}
    <guid>${postUrl}</guid>
  </item>`;
    })
    .join('\n');

  // Build RSS 2.0 feed
  const rssBody = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title>홍마초의 잡생각</title>
    <link>${channelLink}</link>
    <description>dev, invest, learn, daily</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rssBody, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
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

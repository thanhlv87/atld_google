/**
 * Generate sitemap.xml for SEO
 * This is a utility to manually generate sitemap
 * Run this when you want to update the sitemap
 */

import { db, collection, getDocs, query, where } from '../services/firebaseConfig';
import { BlogPost } from '../types';

const SITE_URL = 'https://atld.web.app';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: `${SITE_URL}/`,
    changefreq: 'daily',
    priority: 1.0
  });

  urls.push({
    loc: `${SITE_URL}/requests`,
    changefreq: 'hourly',
    priority: 0.9
  });

  urls.push({
    loc: `${SITE_URL}/blog`,
    changefreq: 'daily',
    priority: 0.9
  });

  urls.push({
    loc: `${SITE_URL}/documents`,
    changefreq: 'weekly',
    priority: 0.7
  });

  // Training landing pages
  const trainingTypes = [
    'an-toan-dien',
    'an-toan-xay-dung',
    'an-toan-hoa-chat',
    'pccc',
    'an-toan-buc-xa',
    'quan-trac-moi-truong',
    'danh-gia-phan-loai-lao-dong',
    'so-cap-cuu'
  ];

  trainingTypes.forEach(type => {
    urls.push({
      loc: `${SITE_URL}/training-${type}`,
      changefreq: 'monthly',
      priority: 0.6
    });
  });

  // Get all published blog posts
  try {
    const blogsRef = collection(db, 'blogPosts');
    const q = query(blogsRef, where('published', '==', true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const post = doc.data() as BlogPost;
      const lastmod = post.updatedAt?.toDate().toISOString().split('T')[0] ||
                      post.createdAt?.toDate().toISOString().split('T')[0];

      urls.push({
        loc: `${SITE_URL}/blog/${doc.id}`,
        lastmod: lastmod,
        changefreq: 'monthly',
        priority: 0.8
      });
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return xml;
};

/**
 * Download sitemap as file
 */
export const downloadSitemap = async () => {
  const xml = await generateSitemap();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Copy sitemap to clipboard
 */
export const copySitemapToClipboard = async () => {
  const xml = await generateSitemap();
  await navigator.clipboard.writeText(xml);
  alert('Sitemap đã được sao chép vào clipboard!');
};

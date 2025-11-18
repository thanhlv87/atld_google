/**
 * Generate sitemap.xml for SEO
 * This script can be run manually or integrated into the build process
 *
 * Usage: node scripts/generateSitemap.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config - same as your app
const firebaseConfig = {
  apiKey: "AIzaSyBiJGS0vd5xwHFPmNbE4YVwxZc5HsQ-xOM",
  authDomain: "atld.firebaseapp.com",
  projectId: "gen-lang-client-0113063590",
  storageBucket: "gen-lang-client-0113063590.firebasestorage.app",
  messagingSenderId: "951042361899",
  appId: "1:951042361899:web:3f7d3f8bb7cf3cbe80fea3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://atld.web.app';

// Static pages
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/training', changefreq: 'weekly', priority: '0.9' },
  { url: '/about', changefreq: 'monthly', priority: '0.7' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
];

async function generateSitemap() {
  try {
    console.log('🚀 Starting sitemap generation...');

    // Fetch all published blog posts
    const blogQuery = query(
      collection(db, 'blogPosts'),
      where('published', '==', true)
    );
    const blogSnapshot = await getDocs(blogQuery);

    console.log(`📝 Found ${blogSnapshot.size} published blog posts`);

    // Start XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += '  </url>\n';
    });

    // Add blog posts
    blogSnapshot.forEach(doc => {
      const post = doc.data();
      const lastmod = post.updatedAt?.toDate() || post.publishedAt?.toDate() || post.createdAt?.toDate() || new Date();

      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/blog/${doc.id}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>\n`;
      xml += '  </url>\n';
    });

    // Close XML
    xml += '</urlset>';

    // Write to public folder
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, xml, 'utf8');
    console.log(`✅ Sitemap generated successfully at: ${publicPath}`);

    // Also write to dist folder if it exists
    const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
    if (fs.existsSync(path.join(__dirname, '..', 'dist'))) {
      fs.writeFileSync(distPath, xml, 'utf8');
      console.log(`✅ Sitemap also copied to: ${distPath}`);
    }

    console.log(`\n📊 Sitemap statistics:`);
    console.log(`   - Static pages: ${staticPages.length}`);
    console.log(`   - Blog posts: ${blogSnapshot.size}`);
    console.log(`   - Total URLs: ${staticPages.length + blogSnapshot.size}`);
    console.log(`\n🔗 Sitemap URL: ${BASE_URL}/sitemap.xml`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();

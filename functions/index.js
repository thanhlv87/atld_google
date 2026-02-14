const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onCall, onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { defineSecret } = require('firebase-functions/params');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

initializeApp();
const db = getFirestore();

// Gemini AI Configuration
// Get your API key from: https://aistudio.google.com/app/apikey
// Set via: firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = defineSecret('GEMINI_API_KEY');

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8474740440:AAFmqXZVe0tMLX1KVkuvrV1x-cLPTIo_CSI';
const TELEGRAM_CHAT_ID = '-4801062641'; // Your Telegram Chat ID

/**
 * Send message to Telegram
 */
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error('Error sending Telegram notification:', error.message);
    throw error;
  }
}

/**
 * Format training request data for Telegram message
 */
function formatTrainingRequestMessage(data) {
  const {
    trainingType,
    companyName,
    clientName,
    email,
    phone,
    location,
    numberOfTrainees,
    expectedStartDate,
    additionalInfo,
    createdAt
  } = data;

  const trainingTypeMap = {
    'an-toan-dien': '⚡ An toàn Điện',
    'an-toan-xay-dung': '🏗️ An toàn Xây dựng',
    'an-toan-hoa-chat': '🧪 An toàn Hóa chất',
    'pccc': '🚒 Phòng Cháy Chữa Cháy',
    'an-toan-buc-xa': '☢️ An toàn Bức xạ',
    'quan-trac-moi-truong': '🌿 Quan trắc Môi trường',
    'danh-gia-phan-loai-lao-dong': '📋 Đánh giá Phân loại Lao động',
    'so-cap-cuu': '🏥 Sơ Cấp Cứu'
  };

  const trainingName = trainingTypeMap[trainingType] || trainingType || 'Không xác định';

  // Handle both Firestore Timestamp and regular date
  let date = 'N/A';
  if (createdAt) {
    if (createdAt.toDate) {
      // Firestore Timestamp object
      date = createdAt.toDate().toLocaleString('vi-VN');
    } else if (createdAt.seconds) {
      // Timestamp as object with seconds
      date = new Date(createdAt.seconds * 1000).toLocaleString('vi-VN');
    } else if (createdAt instanceof Date) {
      // Regular Date object
      date = createdAt.toLocaleString('vi-VN');
    }
  }

  return `
🔔 <b>YÊU CẦU ĐÀO TẠO MỚI</b>

${trainingName}

👤 <b>Người liên hệ:</b> ${clientName || 'Chưa cập nhật'}
🏢 <b>Công ty:</b> ${companyName || 'Chưa cập nhật'}
📧 <b>Email:</b> ${email || 'Chưa cập nhật'}
📱 <b>Điện thoại:</b> ${phone || 'Chưa cập nhật'}
📍 <b>Địa điểm:</b> ${location || 'Chưa cập nhật'}
👥 <b>Số học viên:</b> ${numberOfTrainees || 'Chưa cập nhật'} người
📅 <b>Dự kiến bắt đầu:</b> ${expectedStartDate || 'Chưa cập nhật'}
${additionalInfo ? `\n💬 <b>Ghi chú:</b> ${additionalInfo}` : ''}

⏰ <b>Thời gian:</b> ${date}

🔗 <a href="https://atld.web.app/admin">Xem chi tiết</a>
  `.trim();
}

/**
 * Cloud Function: Triggered when a new training request is created
 */
exports.notifyNewTrainingRequest = onDocumentCreated('trainingRequests/{requestId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }

  const requestData = snapshot.data();
  const requestId = event.params.requestId;

  console.log('New training request created:', requestId);
  console.log('Request data:', JSON.stringify(requestData, null, 2));

  // Check if Telegram Chat ID is configured
  if (!TELEGRAM_CHAT_ID) {
    console.warn('TELEGRAM_CHAT_ID not configured. Skipping notification.');
    return;
  }

  try {
    const message = formatTrainingRequestMessage(requestData);
    await sendTelegramMessage(message);
    console.log('Notification sent for request:', requestId);
  } catch (error) {
    console.error('Error in notifyNewTrainingRequest:', error);
    // Don't throw error to avoid function retry
  }
});

/**
 * Callable function: Test Telegram notification
 */
exports.testTelegramNotification = onCall(async (request) => {
  // Only allow authenticated users
  if (!request.auth) {
    throw new Error('User must be authenticated');
  }

  const testMessage = `
🧪 <b>TEST NOTIFICATION</b>

Đây là tin nhắn thử nghiệm từ SafetyConnect Bot.

✅ Bot đang hoạt động bình thường!

👤 <b>Tested by:</b> ${request.auth.token.email || 'Unknown'}

⏰ ${new Date().toLocaleString('vi-VN')}
  `.trim();

  try {
    await sendTelegramMessage(testMessage);
    return { success: true, message: 'Test notification sent successfully' };
  } catch (error) {
    console.error('Test notification failed:', error);
    throw new Error('Failed to send test notification: ' + error.message);
  }
});

/**
 * AI Blog Writer - Generate blog post using Gemini AI
 */
exports.generateBlogPost = onCall({ secrets: [geminiApiKey] }, async (request) => {
  // Only allow authenticated users
  if (!request.auth) {
    throw new Error('User must be authenticated');
  }

  const { topic, category, keywords } = request.data;

  if (!topic) {
    throw new Error('Topic is required');
  }

  console.log('Generating blog post for topic:', topic);

  try {
    // Initialize Gemini AI with secret
    const genAI = new GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Craft specialized prompt for Occupational Safety blog (SEO-optimized)
    const prompt = `Bạn là một chuyên gia về An toàn Lao động tại Việt Nam, đồng thời là chuyên gia SEO. Hãy viết một bài blog chuyên nghiệp, chi tiết, hữu ích và TỐI ƯU SEO về chủ đề sau:

Chủ đề: ${topic}
Danh mục: ${category || 'An toàn lao động'}
${keywords ? `Từ khóa chính: ${keywords}` : ''}

YÊU CẦU NỘI DUNG:
1. Viết bằng tiếng Việt chuẩn, chuyên nghiệp
2. Nội dung phải chính xác, dựa trên quy định pháp luật Việt Nam (Luật An toàn Lao động, các Nghị định, Thông tư liên quan)
3. Độ dài: 800-1200 từ
4. Bao gồm: Mở bài giới thiệu vấn đề → Nội dung chính với tiểu mục → Kết luận và khuyến nghị
5. Đưa ra ví dụ thực tế nếu có thể

YÊU CẦU SEO (QUAN TRỌNG):
1. TIÊU ĐỀ (title): 50-60 ký tự, chứa từ khóa chính ở đầu, hấp dẫn và rõ ràng
2. TÓM TẮT (excerpt): 150-160 ký tự, mô tả hấp dẫn kêu gọi hành động, chứa từ khóa chính
3. CẤU TRÚC HEADING: Dùng đúng 1 <h2> cho tiêu đề phần chính, <h3> cho tiểu mục. KHÔNG dùng <h1> (đã dùng cho title)
4. MẬT ĐỘ TỪ KHÓA: Từ khóa chính xuất hiện tự nhiên 3-5 lần trong bài, từ khóa phụ 1-2 lần
5. ĐOẠN ĐẦU TIÊN: Phải chứa từ khóa chính trong 100 từ đầu
6. TAGS: 5-7 tags, bao gồm cả long-tail keywords, viết bằng tiếng Việt có dấu
7. FORMAT HTML: Dùng <p>, <strong>, <em>, <ul>, <ol>, <li>, <h2>, <h3>, <blockquote>
8. NỘI DUNG: Tự nhiên, không nhồi keyword, cung cấp giá trị thực cho người đọc

Trả về theo định dạng JSON với cấu trúc sau:
{
  "title": "Tiêu đề SEO tối ưu (50-60 ký tự, chứa keyword chính)",
  "excerpt": "Meta description hấp dẫn (150-160 ký tự, chứa keyword + CTA)",
  "content": "Nội dung đầy đủ với HTML formatting, heading hierarchy đúng chuẩn SEO",
  "tags": ["từ khóa chính", "từ khóa phụ 1", "long-tail keyword 1", "long-tail keyword 2", "từ khóa liên quan"],
  "suggestedCategory": "Danh mục phù hợp nhất"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let blogData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      blogData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: return raw text
      blogData = {
        title: topic,
        excerpt: text.substring(0, 200) + '...',
        content: text,
        tags: keywords ? keywords.split(',').map(k => k.trim()) : [],
        suggestedCategory: category || 'An toàn lao động'
      };
    }

    console.log('Blog post generated successfully');
    return {
      success: true,
      data: blogData
    };

  } catch (error) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post: ' + error.message);
  }
});

/**
 * AI Blog Helper - Improve existing content, generate title/excerpt/tags
 */
exports.improveBlogContent = onCall({ secrets: [geminiApiKey] }, async (request) => {
  // Only allow authenticated users
  if (!request.auth) {
    throw new Error('User must be authenticated');
  }

  const { action, content, context } = request.data;

  if (!action) {
    throw new Error('Action is required');
  }

  console.log('Improving blog content, action:', action);

  try {
    // Initialize Gemini AI with secret
    const genAI = new GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';

    switch (action) {
      case 'improve_content':
        prompt = `Bạn là chuyên gia An toàn Lao động. Hãy cải thiện nội dung blog sau:

${content}

Yêu cầu:
- Sửa lỗi chính tả, ngữ pháp
- Cải thiện cấu trúc câu, đoạn văn
- Tối ưu SEO tự nhiên
- Giữ nguyên ý nghĩa và tone chuyên nghiệp
- Trả về nội dung đã cải thiện (với HTML formatting)`;
        break;

      case 'generate_title':
        prompt = `Dựa vào nội dung blog về An toàn Lao động sau, hãy tạo 5 tiêu đề hấp dẫn, SEO-friendly (60-80 ký tự mỗi tiêu đề):

${content}

Trả về dưới dạng JSON array: ["Tiêu đề 1", "Tiêu đề 2", "Tiêu đề 3", "Tiêu đề 4", "Tiêu đề 5"]`;
        break;

      case 'generate_excerpt':
        prompt = `Hãy tóm tắt nội dung blog sau thành excerpt ngắn gọn, hấp dẫn (150-200 ký tự):

${content}

Excerpt phải:
- Thu hút người đọc
- Nêu bật vấn đề chính
- Kết thúc tự nhiên (không bị cắt ngang)

Chỉ trả về excerpt, không giải thích thêm.`;
        break;

      case 'generate_tags':
        prompt = `Phân tích nội dung blog về An toàn Lao động sau và đề xuất 5-8 tags phù hợp:

${content}

Tags phải:
- Liên quan chặt chẽ đến nội dung
- Ngắn gọn, dễ tìm kiếm
- Viết thường, không dấu (slug format)
- VD: an-toan-dien, pccc, luat-le

Trả về dưới dạng JSON array: ["tag1", "tag2", "tag3", ...]`;
        break;

      default:
        throw new Error('Invalid action');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Try to parse JSON if applicable
    if (action === 'generate_title' || action === 'generate_tags') {
      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*?\]/);
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
        text = JSON.parse(jsonText);
      } catch (parseError) {
        console.warn('Failed to parse as JSON, returning raw text');
      }
    }

    console.log('Content improvement completed');
    return {
      success: true,
      data: text
    };

  } catch (error) {
    console.error('Error improving content:', error);
    throw new Error('Failed to improve content: ' + error.message);
  }
});

/**
 * Escape HTML entities to prevent XSS in meta tags
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Known social media and search engine crawler user-agents
 */
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit', 'Facebot',
  'Twitterbot', 'TwitterBot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot', 'Slack-ImgProxy',
  'TelegramBot',
  'Googlebot', 'Google-InspectionTool',
  'bingbot', 'msnbot',
  'Zalobot',
  'viber',
  'Pinterest', 'PinterestBot',
  'Discordbot',
  'Applebot',
  'Yandex',
  'rogerbot',
  'SemrushBot',
  'AhrefsBot',
  'DotBot',
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

/**
 * Fetch and serve the SPA's index.html for regular browsers
 */
async function serveSPAForBrowser(res) {
  try {
    const response = await fetch('https://atld.web.app/index.html');
    const html = await response.text();
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(html);
  } catch (error) {
    console.error('Error fetching index.html:', error);
    // Last resort fallback
    res.redirect(302, 'https://atld.web.app/');
  }
}

/**
 * SEO-friendly Blog Post Meta Tags for Social Media Crawlers
 * Serves HTML with proper OG tags for Facebook, Twitter, Zalo etc.
 * Regular browsers receive the SPA's index.html directly (no redirect loop).
 * Supports slug-based URLs with fallback to document ID for backward compatibility.
 */
exports.blogMetaTags = onRequest(async (req, res) => {
  const urlPath = req.url || req.path;
  const userAgent = req.headers['user-agent'] || '';

  // Extract slug/id from path: /blog/SLUG_OR_ID
  const pathMatch = urlPath.match(/\/blog\/([^/?#]+)/);
  const slugOrId = pathMatch ? pathMatch[1] : '';

  console.log('blogMetaTags called:', { urlPath, slugOrId, isCrawler: isCrawler(userAgent) });

  // If NOT a crawler (regular browser), serve the SPA directly
  if (!isCrawler(userAgent)) {
    return serveSPAForBrowser(res);
  }

  // If accessing /blog listing (crawler), redirect to homepage
  if (!slugOrId || slugOrId === 'blog') {
    res.redirect(302, 'https://atld.web.app/');
    return;
  }

  try {
    let postDoc = null;
    let postId = slugOrId;

    // Try to find by slug first
    const slugQuery = db.collection('blogPosts').where('slug', '==', slugOrId).limit(1);
    const slugSnapshot = await slugQuery.get();

    if (!slugSnapshot.empty) {
      postDoc = slugSnapshot.docs[0];
      postId = postDoc.id;
    } else {
      // Fallback: try by document ID (backward compatibility)
      const idDoc = await db.collection('blogPosts').doc(slugOrId).get();
      if (idDoc.exists) {
        postDoc = idDoc;
        postId = idDoc.id;
      }
    }

    if (!postDoc || !postDoc.exists) {
      console.log('Post not found:', slugOrId);
      res.redirect(302, 'https://atld.web.app/blog');
      return;
    }

    const post = postDoc.data();
    // Use slug in URL if available, otherwise use ID
    const blogSlug = post.slug || postId;
    const url = `https://atld.web.app/blog/${blogSlug}`;

    const title = escapeHtml(post.title);
    const excerpt = escapeHtml(post.excerpt);
    const siteName = 'SafetyConnect';
    const coverImage = post.coverImage || '';
    const authorName = escapeHtml(post.author?.name || 'SafetyConnect');
    const keywords = (post.tags || []).map(t => escapeHtml(t)).join(', ');
    const category = escapeHtml(post.category || '');
    const publishedDate = post.publishedAt?.toDate?.()?.toISOString() || post.createdAt?.toDate?.()?.toISOString() || '';
    const modifiedDate = post.updatedAt?.toDate?.()?.toISOString() || publishedDate;

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>${title} | ${siteName}</title>
  <meta name="title" content="${title} | ${siteName}" />
  <meta name="description" content="${excerpt}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="author" content="${authorName}" />
  <link rel="canonical" href="${url}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${excerpt}" />
  <meta property="og:image" content="${coverImage}" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:locale" content="vi_VN" />
  <meta property="article:published_time" content="${publishedDate}" />
  <meta property="article:modified_time" content="${modifiedDate}" />
  <meta property="article:author" content="${authorName}" />
  <meta property="article:section" content="${category}" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${url}" />
  <meta property="twitter:title" content="${title}" />
  <meta property="twitter:description" content="${excerpt}" />
  <meta property="twitter:image" content="${coverImage}" />
  
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title}",
    "description": "${excerpt}",
    "image": "${coverImage}",
    "datePublished": "${publishedDate}",
    "dateModified": "${modifiedDate}",
    "author": {
      "@type": "Person",
      "name": "${authorName}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "${siteName}",
      "logo": {
        "@type": "ImageObject",
        "url": "https://raw.githubusercontent.com/thanhlv87/pic/refs/heads/main/connected.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${url}"
    },
    "keywords": "${keywords}",
    "articleSection": "${category}",
    "inLanguage": "vi-VN"
  }
  </script>
  
  <!-- Redirect to actual SPA page -->
  <meta http-equiv="refresh" content="0; url=${url}" />
  <script>window.location.href = "${url}";</script>
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a>...</p>
</body>
</html>`;

    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.send(html);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.redirect(302, 'https://atld.web.app/blog');
  }
});

/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml dynamically with all published blog posts using slug-based URLs.
 */
exports.dynamicSitemap = onRequest(async (req, res) => {
  try {
    const BASE_URL = 'https://atld.web.app';
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/blog', changefreq: 'daily', priority: '0.9' },
      { url: '/requests', changefreq: 'weekly', priority: '0.9' },
      { url: '/documents', changefreq: 'weekly', priority: '0.8' },
      { url: '/partners', changefreq: 'weekly', priority: '0.8' },
      { url: '/chat', changefreq: 'weekly', priority: '0.7' },
      { url: '/training/an-toan-dien', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/an-toan-xay-dung', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/an-toan-hoa-chat', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/pccc', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/an-toan-buc-xa', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/quan-trac-moi-truong', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/danh-gia-phan-loai-lao-dong', changefreq: 'monthly', priority: '0.8' },
      { url: '/training/so-cap-cuu', changefreq: 'monthly', priority: '0.8' },
    ];

    // Fetch all published blog posts
    const blogSnapshot = await db.collection('blogPosts')
      .where('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .get();

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add blog posts with slug-based URLs
    blogSnapshot.forEach(doc => {
      const post = doc.data();
      const blogSlug = post.slug || doc.id;
      const lastmod = post.updatedAt?.toDate() || post.publishedAt?.toDate() || post.createdAt?.toDate() || new Date();

      xml += '  <url>\n';
      xml += `    <loc>${BASE_URL}/blog/${blogSlug}</loc>\n`;
      xml += `    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=7200');
    res.send(xml);

    console.log(`Dynamic sitemap generated: ${staticPages.length} static + ${blogSnapshot.size} blog = ${staticPages.length + blogSnapshot.size} URLs`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});


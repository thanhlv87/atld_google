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

    // Craft specialized prompt for Occupational Safety blog
    const prompt = `Bạn là một chuyên gia về An toàn Lao động tại Việt Nam. Hãy viết một bài blog chuyên nghiệp, chi tiết và hữu ích về chủ đề sau:

Chủ đề: ${topic}
Danh mục: ${category || 'An toàn lao động'}
${keywords ? `Từ khóa liên quan: ${keywords}` : ''}

Yêu cầu:
1. Viết bằng tiếng Việt chuẩn, chuyên nghiệp
2. Nội dung phải chính xác, dựa trên quy định pháp luật Việt Nam (Luật An toàn Lao động, các Nghị định, Thông tư liên quan)
3. Cấu trúc rõ ràng với các heading (dùng HTML tags: <h2>, <h3>)
4. Độ dài: 800-1200 từ
5. Bao gồm:
   - Mở bài giới thiệu vấn đề
   - Nội dung chính với các tiểu mục
   - Phần kết luận và khuyến nghị
6. Sử dụng các thẻ HTML để format: <p>, <strong>, <em>, <ul>, <ol>, <li>
7. Tạo nội dung SEO-friendly nhưng tự nhiên
8. Đưa ra ví dụ thực tế nếu có thể

Trả về theo định dạng JSON với cấu trúc sau:
{
  "title": "Tiêu đề bài viết hấp dẫn (60-80 ký tự)",
  "excerpt": "Tóm tắt ngắn gọn 2-3 câu (150-200 ký tự)",
  "content": "Nội dung đầy đủ với HTML formatting",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
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
 * SEO-friendly Blog Post Meta Tags for Social Media Crawlers
 * Serves HTML with proper OG tags for Facebook, Twitter, etc.
 */
exports.blogMetaTags = onRequest(async (req, res) => {
  // Get postId from URL path or query parameter
  // Firebase hosting rewrite sends: /blog/POST_ID -> function receives path or query
  const urlPath = req.url || req.path;
  let postId = '';

  // Try to extract from path: /blog/POST_ID or /POST_ID
  const pathMatch = urlPath.match(/\/blog\/([^/?]+)|^\/([^/?]+)/);
  if (pathMatch) {
    postId = pathMatch[1] || pathMatch[2];
  }

  // Also check query parameter as fallback
  if (!postId && req.query && req.query.postId) {
    postId = req.query.postId;
  }

  console.log('blogMetaTags called with URL:', urlPath, 'postId:', postId);

  if (!postId) {
    console.log('No postId found, redirecting to home');
    res.redirect(302, 'https://atld.web.app/');
    return;
  }

  try {
    const postDoc = await db.collection('blogPosts').doc(postId).get();

    if (!postDoc.exists) {
      console.log('Post not found:', postId);
      res.redirect(302, 'https://atld.web.app/');
      return;
    }

    const post = postDoc.data();
    const url = `https://atld.web.app/blog/${postId}`;
    
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>${post.title} | SafetyConnect</title>
  <meta name="title" content="${post.title} | SafetyConnect" />
  <meta name="description" content="${post.excerpt}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.excerpt}" />
  <meta property="og:image" content="${post.coverImage}" />
  <meta property="og:site_name" content="SafetyConnect" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${url}" />
  <meta property="twitter:title" content="${post.title}" />
  <meta property="twitter:description" content="${post.excerpt}" />
  <meta property="twitter:image" content="${post.coverImage}" />
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0; url=${url}" />
  <script>window.location.href = "${url}";</script>
</head>
<body>
  <p>Redirecting to <a href="${url}">${post.title}</a>...</p>
</body>
</html>`;
    
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    res.send(html);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.redirect(302, 'https://atld.web.app/');
  }
});

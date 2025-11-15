const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onCall } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const axios = require('axios');

initializeApp();

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

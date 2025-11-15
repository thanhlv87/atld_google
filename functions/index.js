const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8474740440:AAFmqXZVe0tMLX1KVkuvrV1x-cLPTIo_CSI';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''; // Set this in Firebase config

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

  const trainingName = trainingTypeMap[trainingType] || trainingType;
  const date = createdAt ? new Date(createdAt.seconds * 1000).toLocaleString('vi-VN') : 'N/A';

  return `
🔔 <b>YÊU CẦU ĐÀO TẠO MỚI</b>

${trainingName}

👤 <b>Người liên hệ:</b> ${clientName}
🏢 <b>Công ty:</b> ${companyName}
📧 <b>Email:</b> ${email}
📱 <b>Điện thoại:</b> ${phone}
📍 <b>Địa điểm:</b> ${location}
👥 <b>Số học viên:</b> ${numberOfTrainees} người
📅 <b>Dự kiến bắt đầu:</b> ${expectedStartDate}
${additionalInfo ? `\n💬 <b>Ghi chú:</b> ${additionalInfo}` : ''}

⏰ <b>Thời gian:</b> ${date}

🔗 <a href="https://atld.web.app/admin">Xem chi tiết</a>
  `.trim();
}

/**
 * Cloud Function: Triggered when a new training request is created
 */
exports.notifyNewTrainingRequest = functions.firestore
  .document('trainingRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const requestData = snap.data();
    const requestId = context.params.requestId;

    console.log('New training request created:', requestId);

    // Check if Telegram Chat ID is configured
    if (!TELEGRAM_CHAT_ID) {
      console.warn('TELEGRAM_CHAT_ID not configured. Skipping notification.');
      return null;
    }

    try {
      const message = formatTrainingRequestMessage(requestData);
      await sendTelegramMessage(message);
      console.log('Notification sent for request:', requestId);
      return null;
    } catch (error) {
      console.error('Error in notifyNewTrainingRequest:', error);
      // Don't throw error to avoid function retry
      return null;
    }
  });

/**
 * Callable function: Test Telegram notification
 */
exports.testTelegramNotification = functions.https.onCall(async (data, context) => {
  // Only allow admins to test
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const testMessage = `
🧪 <b>TEST NOTIFICATION</b>

Đây là tin nhắn thử nghiệm từ SafetyConnect Bot.

✅ Bot đang hoạt động bình thường!

⏰ ${new Date().toLocaleString('vi-VN')}
  `.trim();

  try {
    await sendTelegramMessage(testMessage);
    return { success: true, message: 'Test notification sent successfully' };
  } catch (error) {
    console.error('Test notification failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send test notification');
  }
});

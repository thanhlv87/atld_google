interface TrainingDetail {
  type: string;
  group: string;
  participants: number;
}

interface ClientInfo {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location: string;
  description: string;
  trainingDuration: string;
  preferredTime: string;
}

/**
 * Generate beautiful HTML email template for partner notification
 */
export const generatePartnerNotificationEmail = (
  trainingDetails: TrainingDetail[],
  clientInfo: ClientInfo,
  isUrgent: boolean = false
): string => {
  const trainingTypesText = trainingDetails.map(d => d.type).join(', ');

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yêu cầu đào tạo mới</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .urgent-badge {
      display: inline-block;
      background-color: #ef4444;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 12px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    .content {
      padding: 40px 30px;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .training-item {
      background-color: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 16px 20px;
      margin-bottom: 12px;
      border-radius: 4px;
    }
    .training-item strong {
      color: #1e3a8a;
      font-size: 16px;
      display: block;
      margin-bottom: 8px;
    }
    .training-item .meta {
      color: #64748b;
      font-size: 14px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .training-item .meta span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .info-item {
      display: flex;
      padding: 12px;
      background-color: #fafafa;
      border-radius: 6px;
    }
    .info-item .label {
      font-weight: 600;
      color: #475569;
      min-width: 120px;
    }
    .info-item .value {
      color: #1e293b;
      flex: 1;
    }
    .cta-button {
      display: block;
      width: 100%;
      max-width: 300px;
      margin: 32px auto;
      padding: 16px 32px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: #ffffff;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }
    .footer {
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
      color: #64748b;
      font-size: 14px;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 24px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
      }
      .info-item {
        flex-direction: column;
        gap: 4px;
      }
      .info-item .label {
        min-width: auto;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>🎯 Yêu Cầu Đào Tạo Mới</h1>
      <p>Cơ hội kinh doanh phù hợp với năng lực của bạn</p>
      ${isUrgent ? '<div class="urgent-badge">⚡ KHẨN CẤP - ƯU TIÊN CAO</div>' : ''}
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Training Details Section -->
      <div class="section">
        <div class="section-title">📚 Nội dung đào tạo yêu cầu</div>
        ${trainingDetails.map(detail => `
          <div class="training-item">
            <strong>${detail.type}</strong>
            <div class="meta">
              <span>👥 Nhóm: ${detail.group}</span>
              <span>🎓 Số lượng: ${detail.participants} học viên</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <!-- Client Information Section -->
      <div class="section">
        <div class="section-title">👤 Thông tin khách hàng</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="label">Tên liên hệ:</div>
            <div class="value">${clientInfo.clientName}</div>
          </div>
          <div class="info-item">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${clientInfo.clientEmail}" style="color: #3b82f6; text-decoration: none;">${clientInfo.clientEmail}</a></div>
          </div>
          <div class="info-item">
            <div class="label">Điện thoại:</div>
            <div class="value"><a href="tel:${clientInfo.clientPhone}" style="color: #3b82f6; text-decoration: none;">${clientInfo.clientPhone}</a></div>
          </div>
          <div class="info-item">
            <div class="label">Địa điểm:</div>
            <div class="value">📍 ${clientInfo.location}</div>
          </div>
          <div class="info-item">
            <div class="label">Thời lượng:</div>
            <div class="value">⏱️ ${clientInfo.trainingDuration}</div>
          </div>
          <div class="info-item">
            <div class="label">Thời gian mong muốn:</div>
            <div class="value">📅 ${clientInfo.preferredTime}</div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Description Section -->
      <div class="section">
        <div class="section-title">📝 Mô tả chi tiết</div>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; line-height: 1.6; color: #334155;">
          ${clientInfo.description}
        </div>
      </div>

      <!-- CTA Button -->
      <a href="https://atld.web.app/login" class="cta-button">
        🔐 Đăng nhập để xem chi tiết & Gửi báo giá
      </a>

      <!-- Info Box -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 24px;">
        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
          💡 <strong>Gợi ý:</strong> Hãy phản hồi nhanh để tăng cơ hội được chọn. Khách hàng thường ưu tiên những đơn vị đào tạo phản hồi sớm và chi tiết nhất.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Hệ thống kết nối đào tạo ATLD</strong></p>
      <p>Email này được gửi tự động từ hệ thống</p>
      <p>Nếu bạn không muốn nhận email thông báo, vui lòng cập nhật trong <a href="https://atld.web.app/settings">Cài đặt tài khoản</a></p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #94a3b8;">
          © ${new Date().getFullYear()} ATLD. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

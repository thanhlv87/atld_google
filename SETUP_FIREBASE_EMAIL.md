# 📧 Hướng dẫn tạo mẫu email trong Firebase

## Tổng quan

Hướng dẫn này sẽ giúp bạn tạo và gửi email thông báo yêu cầu đào tạo mới thông qua Firebase với mẫu email đã thiết kế.

## 📋 Yêu cầu hệ thống

- Project Firebase đã được thiết lập
- Collection `mail` đã được tạo trong Firestore
- Quyền truy cập Firestore database

## 🏗️ Cấu trúc dữ liệu email

Để gửi email qua Firebase, bạn cần tạo document trong collection `mail` với cấu trúc sau:

```json
{
  "to": ["email@partner.com"],
  "message": {
    "subject": "🎯 Yêu cầu đào tạo mới: [Loại hình đào tạo]",
    "html": "<html>...mẫu email HTML đã tạo...</html>"
  }
}
```

## 📝 Ví dụ cụ thể

Dưới đây là ví dụ về cách tạo document trong Firebase Console:

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `gen-lang-client-0113063590`
3. Vào **Firestore Database** → collection `mail`
4. **Add document** với dữ liệu:

```json
{
  "to": ["partner@example.com"],
  "message": {
    "subject": "🎯 Yêu cầu đào tạo mới: Team Building, Kỹ năng lãnh đạo",
    "html": "<!DOCTYPE html><html lang=\"vi\">... toàn bộ HTML từ mẫu email đã tạo ...</html>"
  }
}
```

## 🔧 Sử dụng trong code

### Import hàm tạo email template

```typescript
import { generatePartnerNotificationEmail } from '../utils/emailTemplates';
```

### Tạo và gửi email

```typescript
const trainingDetails = [
  {
    type: "Team Building",
    group: "Nhóm 20-50 người",
    participants: 35
  },
  {
    type: "Kỹ năng lãnh đạo",
    group: "Nhóm 10-20 người",
    participants: 15
  }
];

const clientInfo = {
  clientName: "Nguyễn Văn A",
  clientEmail: "nguyenvana@company.com",
  clientPhone: "0901234567",
  location: "Hà Nội",
  description: "Công ty chúng tôi muốn tổ chức khóa đào tạo team building và kỹ năng lãnh đạo cho đội ngũ quản lý cấp trung. Mong muốn giảng viên có kinh nghiệm thực tế trong lĩnh vực quản lý doanh nghiệp.",
  trainingDuration: "2 ngày",
  preferredTime: "Tháng 12/2024"
};

// Tạo HTML email
const emailHtml = generatePartnerNotificationEmail(
  trainingDetails,
  clientInfo,
  true  // isUrgent = true
);

// Tạo document trong Firestore
const emailDoc = {
  to: ["partner@example.com"],
  message: {
    subject: "🎯 Yêu cầu đào tạo mới: Team Building, Kỹ năng lãnh đạo",
    html: emailHtml
  }
};

// Thêm vào collection 'mail'
await db.collection('mail').add(emailDoc);
```

## 🧪 Mẫu dữ liệu thử nghiệm

Dưới đây là mẫu dữ liệu đầy đủ bạn có thể dùng để test trong Firebase Console:

```json
{
  "to": ["your-email@gmail.com"],
  "message": {
    "subject": "🎯 Yêu cầu đào tạo mới: Team Building, Kỹ năng lãnh đạo",
    "html": "<!DOCTYPE html>\n<html lang=\"vi\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Yêu cầu đào tạo mới</title>\n  <style>\n    body {\n      margin: 0;\n      padding: 0;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n      background-color: #f5f5f5;\n      color: #333333;\n    }\n    .email-container {\n      max-width: 600px;\n      margin: 20px auto;\n      background-color: #ffffff;\n      border-radius: 12px;\n      overflow: hidden;\n      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n    }\n    .header {\n      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);\n      padding: 40px 30px;\n      text-align: center;\n      color: #ffffff;\n    }\n    .header h1 {\n      margin: 0;\n      font-size: 28px;\n      font-weight: 700;\n      letter-spacing: -0.5px;\n    }\n    .header p {\n      margin: 10px 0 0 0;\n      font-size: 16px;\n      opacity: 0.95;\n    }\n    .urgent-badge {\n      display: inline-block;\n      background-color: #ef4444;\n      color: white;\n      padding: 8px 16px;\n      border-radius: 20px;\n      font-size: 14px;\n      font-weight: 600;\n      margin-top: 12px;\n      animation: pulse 2s infinite;\n    }\n    @keyframes pulse {\n      0%, 100% { opacity: 1; }\n      50% { opacity: 0.8; }\n    }\n    .content {\n      padding: 40px 30px;\n    }\n    .section {\n      margin-bottom: 32px;\n    }\n    .section-title {\n      font-size: 18px;\n      font-weight: 700;\n      color: #1e3a8a;\n      margin-bottom: 16px;\n      padding-bottom: 8px;\n      border-bottom: 2px solid #e5e7eb;\n    }\n    .training-item {\n      background-color: #f8fafc;\n      border-left: 4px solid #3b82f6;\n      padding: 16px 20px;\n      margin-bottom: 12px;\n      border-radius: 4px;\n    }\n    .training-item strong {\n      color: #1e3a8a;\n      font-size: 16px;\n      display: block;\n      margin-bottom: 8px;\n    }\n    .training-item .meta {\n      color: #64748b;\n      font-size: 14px;\n      display: flex;\n      gap: 20px;\n      flex-wrap: wrap;\n    }\n    .training-item .meta span {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n    }\n    .info-grid {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 12px;\n    }\n    .info-item {\n      display: flex;\n      padding: 12px;\n      background-color: #fafafa;\n      border-radius: 6px;\n    }\n    .info-item .label {\n      font-weight: 600;\n      color: #475569;\n      min-width: 120px;\n    }\n    .info-item .value {\n      color: #1e293b;\n      flex: 1;\n    }\n    .cta-button {\n      display: block;\n      width: 100%;\n      max-width: 300px;\n      margin: 32px auto;\n      padding: 16px 32px;\n      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);\n      color: #ffffff;\n      text-align: center;\n      text-decoration: none;\n      border-radius: 8px;\n      font-size: 16px;\n      font-weight: 600;\n      transition: transform 0.2s, box-shadow 0.2s;\n      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n    }\n    .cta-button:hover {\n      transform: translateY(-2px);\n      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);\n    }\n    .footer {\n      background-color: #f8fafc;\n      padding: 30px;\n      text-align: center;\n      border-top: 1px solid #e5e7eb;\n    }\n    .footer p {\n      margin: 8px 0;\n      color: #64748b;\n      font-size: 14px;\n    }\n    .footer a {\n      color: #3b82f6;\n      text-decoration: none;\n    }\n    .divider {\n      height: 1px;\n      background: linear-gradient(to right, transparent, #e5e7eb, transparent);\n      margin: 24px 0;\n    }\n    @media only screen and (max-width: 600px) {\n      .email-container {\n        margin: 0;\n        border-radius: 0;\n      }\n      .header {\n        padding: 30px 20px;\n      }\n      .header h1 {\n        font-size: 24px;\n      }\n      .content {\n        padding: 30px 20px;\n      }\n      .info-item {\n        flex-direction: column;\n        gap: 4px;\n      }\n      .info-item .label {\n        min-width: auto;\n      }\n    }\n  </style>\n</head>\n<body>\n <div class=\"email-container\">\n    <div class=\"header\">\n      <h1>🎯 Yêu Cầu Đào Tạo Mới</h1>\n      <p>Cơ hội kinh doanh phù hợp với năng lực của bạn</p>\n      <div class=\"urgent-badge\">⚡ KHẨN CẤP - ƯU TIÊN CAO</div>\n    </div>\n\n    <div class=\"content\">\n      <div class=\"section\">\n        <div class=\"section-title\">📚 Nội dung đào tạo yêu cầu</div>\n        <div class=\"training-item\">\n          <strong>Team Building</strong>\n          <div class=\"meta\">\n            <span>👥 Nhóm: 20-50 người</span>\n            <span>🎓 Số lượng: 35 học viên</span>\n          </div>\n        </div>\n        <div class=\"training-item\">\n          <strong>Kỹ năng lãnh đạo</strong>\n          <div class=\"meta\">\n            <span>👥 Nhóm: 10-20 người</span>\n            <span>🎓 Số lượng: 15 học viên</span>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"divider\"></div>\n\n      <div class=\"section\">\n        <div class=\"section-title\">👤 Thông tin khách hàng</div>\n        <div class=\"info-grid\">\n          <div class=\"info-item\">\n            <div class=\"label\">Tên liên hệ:</div>\n            <div class=\"value\">Nguyễn Văn A</div>\n          </div>\n          <div class=\"info-item\">\n            <div class=\"label\">Email:</div>\n            <div class=\"value\"><a href=\"mailto:nguyenvana@company.com\" style=\"color: #3b82f6; text-decoration: none;\">nguyenvana@company.com</a></div>\n          </div>\n          <div class=\"info-item\">\n            <div class=\"label\">Điện thoại:</div>\n            <div class=\"value\"><a href=\"tel:0901234567\" style=\"color: #3b82f6; text-decoration: none;\">0901234567</a></div>\n          </div>\n          <div class=\"info-item\">\n            <div class=\"label\">Địa điểm:</div>\n            <div class=\"value\">📍 Hà Nội</div>\n          </div>\n          <div class=\"info-item\">\n            <div class=\"label\">Thời lượng:</div>\n            <div class=\"value\">⏱️ 2 ngày</div>\n          </div>\n          <div class=\"info-item\">\n            <div class=\"label\">Thời gian mong muốn:</div>\n            <div class=\"value\">📅 Tháng 12/2024</div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"divider\"></div>\n\n      <div class=\"section\">\n        <div class=\"section-title\">📝 Mô tả chi tiết</div>\n        <div style=\"background-color: #f8fafc; padding: 16px; border-radius: 6px; line-height: 1.6; color: #334155;\">\n          Công ty chúng tôi muốn tổ chức khóa đào tạo team building và kỹ năng lãnh đạo cho đội ngũ quản lý cấp trung. Mong muốn giảng viên có kinh nghiệm thực tế trong lĩnh vực quản lý doanh nghiệp.\n        </div>\n      </div>\n\n      <a href=\"https://atld.web.app/login\" class=\"cta-button\">\n        🔐 Đăng nhập để xem chi tiết & Gửi báo giá\n      </a>\n\n      <div style=\"background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 24px;\">\n        <p style=\"margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;\">\n          💡 <strong>Gợi ý:</strong> Hãy phản hồi nhanh để tăng cơ hội được chọn. Khách hàng thường ưu tiên những đơn vị đào tạo phản hồi sớm và chi tiết nhất.\n        </p>\n      </div>\n    </div>\n\n    <div class=\"footer\">\n      <p><strong>Hệ thống kết nối đào tạo ATLD</strong></p>\n      <p>Email này được gửi tự động từ hệ thống</p>\n      <p>Nếu bạn không muốn nhận email thông báo, vui lòng cập nhật trong <a href=\"https://atld.web.app/settings\">Cài đặt tài khoản</a></p>\n      <div style=\"margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;\">\n        <p style=\"font-size: 12px; color: #94a3b8;\">\n          © 2025 ATLD. All rights reserved.\n        </p>\n      </div>\n    </div>\n  </div>\n</body>\n</html>"
  }
}
```

## 📊 Theo dõi trạng thái gửi email

Sau khi tạo document trong collection `mail`, hệ thống sẽ xử lý và gửi email. Bạn có thể kiểm tra trạng thái trong cùng document:

```json
{
  "to": [...],
  "message": {...},
  "delivery": {
    "state": "SUCCESS",        // SUCCESS | ERROR | PENDING
    "attempts": 1,
    "startTime": "...",
    "endTime": "...",
    "error": "..."             // Chỉ có khi state = ERROR
  }
}
```

## 🔧 Tùy chỉnh

Bạn có thể tùy chỉnh màu sắc, fonts và layout trong file `utils/emailTemplates.ts` theo nhu cầu của bạn:

- Thay đổi màu: Sửa các giá trị màu trong CSS như `#3b82f6`, `#1e3a8a`, v.v.
- Thay đổi fonts: Sửa thuộc tính `font-family` trong CSS
- Thay đổi layout spacing: Sửa các giá trị padding, margin trong CSS
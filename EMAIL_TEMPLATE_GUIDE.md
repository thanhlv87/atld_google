# 📧 Email Template Guide

## Tổng quan

Email template mới được thiết kế để gửi thông báo đẹp và chuyên nghiệp cho đối tác khi có yêu cầu đào tạo mới.

## ✨ Tính năng

### Design

- 🎨 **Modern & Professional**: Gradient header, rounded corners, shadow effects
- 📱 **Responsive**: Tự động adapt cho mobile và desktop
- 🔵 **Brand Colors**: Sử dụng màu primary blue (#3b82f6) cho consistency
- ⚡ **Urgent Badge**: Badge đỏ với animation pulse cho yêu cầu khẩn cấp
- 📊 **Clear Layout**: Sections rõ ràng với dividers và icons

### Nội dung

- 📚 **Training Details**: Hiển thị từng nội dung đào tạo với card design
- 👤 **Client Info**: Grid layout dễ đọc với icons
- 📝 **Description**: Highlighted description box
- 🔐 **CTA Button**: Call-to-action button nổi bật với hover effect
- 💡 **Tips**: Info box gợi ý phản hồi nhanh
- 🔗 **Clickable Links**: Email và phone có thể click để liên hệ ngay

### Email Client Support

✅ Gmail
✅ Outlook
✅ Apple Mail
✅ Yahoo Mail
✅ Mobile email apps

## 🎯 Preview Email

### Cách 1: Mở file HTML preview

1. Mở file `email-preview.html` trong browser:

   ```bash
   open email-preview.html
   # hoặc
   firefox email-preview.html
   # hoặc
   google-chrome email-preview.html
   ```

2. Toggle giữa "Email thường" và "Email khẩn cấp" để xem cả 2 variants

### Cách 2: Test thật trong Firestore

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `gen-lang-client-0113063590`
3. Vào **Firestore Database** → collection `mail`
4. **Add document** với data mẫu (xem phần Test Data bên dưới)
5. Check email inbox của bạn

## 📝 Sử dụng trong code

### Import

```typescript
import { generatePartnerNotificationEmail } from '../utils/emailTemplates';
```

### Generate email HTML

```typescript
const emailHtml = generatePartnerNotificationEmail(
  trainingDetails, // Array of { type, group, participants }
  clientInfo, // Object with client information
  isUrgent // boolean - true for urgent requests
);
```

### Send email

```typescript
await sendEmail(
  recipientEmails, // string[] - array of email addresses
  subject, // string - email subject
  emailHtml // string - HTML content from generator
);
```

### Ví dụ đầy đủ

```typescript
const trainingDetails = [
  {
    type: 'Team Building',
    group: 'Nhóm 20-50 người',
    participants: 35,
  },
  {
    type: 'Kỹ năng lãnh đạo',
    group: 'Nhóm 10-20 người',
    participants: 15,
  },
];

const clientInfo = {
  clientName: 'Nguyễn Văn A',
  clientEmail: 'nguyenvana@company.com',
  clientPhone: '0901234567',
  location: 'Hà Nội',
  description: 'Mô tả yêu cầu...',
  trainingDuration: '2 ngày',
  preferredTime: 'Tháng 12/2024',
};

const emailHtml = generatePartnerNotificationEmail(
  trainingDetails,
  clientInfo,
  false // isUrgent = false
);

await sendEmail(
  ['partner@example.com'],
  '🎯 Yêu cầu đào tạo mới: Team Building, Kỹ năng lãnh đạo',
  emailHtml
);
```

## 🧪 Test Data for Firestore

Để test email trong Firestore, tạo document trong collection `mail` với structure:

```json
{
  "to": ["your-email@gmail.com"],
  "message": {
    "subject": "🎯 Yêu cầu đào tạo mới: Team Building",
    "html": "<html>... paste generated HTML here ...</html>"
  }
}
```

Hoặc copy HTML từ `email-preview.html` source code.

## 🎨 Customization

### Thay đổi màu sắc

Edit file `utils/emailTemplates.ts`:

```css
/* Primary color - Header gradient */
background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);

/* Accent color - Borders and links */
border-left: 4px solid #3b82f6;
color: #3b82f6;

/* Urgent color */
background-color: #ef4444;
```

### Thay đổi fonts

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Thay đổi layout spacing

```css
.content {
  padding: 40px 30px; /* Vertical | Horizontal */
}

.section {
  margin-bottom: 32px; /* Spacing between sections */
}
```

## 📊 Email Metrics

Sau khi gửi email, check Firestore document trong collection `mail`:

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

## 🔧 Troubleshooting

### Email không đẹp trong Outlook

- Outlook có một số limitation với CSS
- Template đã được optimize cho Outlook
- Tránh dùng flexbox phức tạp, dùng table hoặc simple blocks

### Email bị vào spam

1. **Setup SPF, DKIM, DMARC** cho domain
2. **Dùng SendGrid/AWS SES** thay vì Gmail cho production
3. **Thêm unsubscribe link** (đã có trong footer)
4. **Avoid spam words** trong subject và content

### Images không hiển thị

- Template hiện tại chỉ dùng emojis (Unicode), không dùng images
- Emojis hiển thị trên mọi email client
- Nếu muốn dùng logo: host image và dùng absolute URL

### Responsive không hoạt động

- Check email client có support media queries không
- Một số client (Gmail app cũ) không support
- Template có fallback layout cho mobile

## 📚 Best Practices

1. **Keep it short**: Email dưới 600px width cho tốt nhất
2. **Clear CTA**: Chỉ có 1 primary CTA button
3. **Test everywhere**: Test trên Gmail, Outlook, Apple Mail
4. **Dark mode**: Template tự động adapt cho dark mode (background trắng)
5. **Alt text**: Nếu dùng images, luôn có alt text
6. **Plain text fallback**: Cân nhắc thêm plain text version

## 🔗 Resources

- [Email Design Best Practices](https://www.campaignmonitor.com/dev-resources/)
- [Litmus Email Testing](https://www.litmus.com/)
- [Can I Email](https://www.caniemail.com/) - CSS support checker
- [Really Good Emails](https://reallygoodemails.com/) - Design inspiration

## 📝 Changelog

### v1.0.0 (2024-11-11)

- Initial release with beautiful responsive design
- Support for urgent/normal variants
- Mobile-optimized layout
- Professional gradient header
- Clear information hierarchy
- CTA button with hover effects
- Footer with unsubscribe option

# Hướng dẫn cài đặt tính năng gửi Email

## Vấn đề hiện tại

Code gửi email đã được implement nhưng **cần cài đặt Firebase Extension** để email thực sự được gửi đi.

## Cách hoạt động

1. Khi có yêu cầu đào tạo mới, hệ thống tự động:
   - Tìm các đối tác phù hợp (đã approved, đăng ký nhận email, có năng lực phù hợp)
   - Tạo document trong Firestore collection `mail`

2. **Firebase Trigger Email Extension** sẽ:
   - Monitor collection `mail`
   - Tự động gửi email khi có document mới
   - Cập nhật trạng thái gửi trong document

## Bước 1: Cài đặt Firebase Extension

### 1.1. Truy cập Firebase Console

1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project: `gen-lang-client-0113063590`
3. Vào menu **Extensions** (ở sidebar bên trái)

### 1.2. Cài đặt "Trigger Email from Firestore"

1. Click **"Install Extension"**
2. Tìm kiếm: **"Trigger Email from Firestore"** hoặc **"firestore-send-email"**
3. Click **"Install in console"**

### 1.3. Cấu hình Extension

Điền các thông tin sau khi được hỏi:

#### A. Collection path
```
mail
```
(Phải khớp với code trong `firebaseConfig.ts:30`)

#### B. SMTP Connection

**Option 1: Sử dụng Gmail (đơn giản cho testing)**

```
SMTP server: smtp.gmail.com
SMTP port: 587
SMTP username: your-email@gmail.com
SMTP password: [App Password - xem hướng dẫn bên dưới]
Email từ: your-email@gmail.com
```

**Cách tạo Gmail App Password:**
1. Vào [Google Account Security](https://myaccount.google.com/security)
2. Bật "2-Step Verification" nếu chưa có
3. Tìm "App passwords" → Generate new password
4. Chọn "Mail" và device của bạn
5. Copy password được tạo ra (16 ký tự)

**Option 2: Sử dụng SendGrid (recommended cho production)**

```
SMTP server: smtp.sendgrid.net
SMTP port: 587
SMTP username: apikey
SMTP password: [Your SendGrid API Key]
Email từ: noreply@yourdomain.com
```

**Cách lấy SendGrid API Key:**
1. Đăng ký tài khoản tại [SendGrid](https://sendgrid.com/)
2. Vào Settings → API Keys → Create API Key
3. Chọn "Full Access" hoặc "Restricted Access" với Mail Send permission
4. Copy API key (chỉ hiện 1 lần)

**Option 3: Sử dụng AWS SES, Mailgun, hoặc service khác**

Tham khảo tài liệu của từng service để lấy thông tin SMTP.

#### C. Default reply-to email (optional)
```
support@yourdomain.com
```

## Bước 2: Deploy Extension

1. Review lại các settings
2. Click **"Install extension"**
3. Đợi vài phút để Firebase deploy extension

## Bước 3: Kiểm tra cài đặt

### 3.1. Xem Extension trong Console

1. Vào **Extensions** → Tab "Installed"
2. Bạn sẽ thấy "Trigger Email from Firestore" với status **Active**

### 3.2. Test gửi email thủ công

Mở Firestore Console và tạo document test:

1. Vào **Firestore Database**
2. Chọn collection `mail`
3. Click "Add document"
4. Điền:
   ```json
   {
     "to": "your-test-email@gmail.com",
     "message": {
       "subject": "Test Email",
       "html": "<h1>Hello!</h1><p>This is a test email.</p>"
     }
   }
   ```
5. Click "Save"

### 3.3. Kiểm tra kết quả

Sau 10-30 giây:

1. **Check email inbox** → Bạn sẽ nhận được email test
2. **Check Firestore document** → Sẽ có field mới:
   ```json
   {
     "delivery": {
       "state": "SUCCESS",
       "attempts": 1,
       "startTime": {...},
       "endTime": {...}
     }
   }
   ```

Nếu có lỗi, field `delivery.error` sẽ chứa thông tin lỗi.

## Bước 4: Test trong ứng dụng

1. Đảm bảo có ít nhất 1 đối tác trong database với:
   - `status: "approved"`
   - `subscribesToEmails: true`
   - `capabilities` chứa loại đào tạo bạn sẽ test

2. Mở ứng dụng và submit form yêu cầu đào tạo

3. Mở **Browser Console** (F12) để xem logs:
   ```
   🔍 Tìm đối tác phù hợp cho các loại đào tạo: [...]
   📊 Tìm thấy X đối tác đã approved và đăng ký nhận email
   ✅ Đối tác phù hợp: email@example.com - Capabilities: [...]
   📧 Số lượng đối tác phù hợp sẽ nhận email: X
   📬 Đang queue email cho: [...]
   ✅ Email đã được queue thành công với ID: xxx
   ```

4. Check Firestore collection `mail` → Sẽ thấy document mới

5. Đợi vài giây → Check email của đối tác test

## Troubleshooting

### Vấn đề 1: Không thấy email được gửi

**Nguyên nhân có thể:**

1. **Extension chưa được cài đặt**
   - Check: Extensions → Installed → Phải có "Trigger Email from Firestore"

2. **SMTP credentials sai**
   - Check: Extensions → "Trigger Email from Firestore" → Reconfigure
   - Test lại với Gmail App Password hoặc SendGrid API key mới

3. **Không có đối tác phù hợp**
   - Check browser console logs
   - Nếu thấy: `⚠️ Không tìm thấy đối tác phù hợp`
   - Kiểm tra Firestore collection `partners`:
     - Có đối tác nào `status == "approved"`?
     - Có đối tác nào `subscribesToEmails == true`?
     - Có đối tác nào có `capabilities` khớp với training type?

4. **Firestore permissions sai**
   - Check Firestore Rules để đảm bảo có quyền write vào `mail` collection

### Vấn đề 2: Email vào spam

**Giải pháp:**

1. Sử dụng custom domain thay vì Gmail
2. Cấu hình SPF, DKIM, DMARC records cho domain
3. Sử dụng SendGrid, Mailgun hoặc AWS SES (có reputation tốt hơn)
4. Thêm unsubscribe link trong email

### Vấn đề 3: Extension báo lỗi

Check logs:

1. Firebase Console → Extensions → "Trigger Email from Firestore"
2. Click "View in Cloud Console"
3. Xem logs để tìm error message cụ thể

## Monitoring & Logs

### Xem logs gửi email

**Firebase Console:**
```
Extensions → Trigger Email from Firestore → View in Cloud Console
```

**Browser Console:**
Khi submit form, bạn sẽ thấy các logs:
- 🔍 Tìm đối tác
- 📊 Số lượng đối tác
- ✅ Đối tác phù hợp
- 📧 Số lượng email sẽ gửi
- 📬 Queue email
- ✅ Email queued thành công

**Firestore Console:**
Xem collection `mail` để theo dõi:
- Documents được tạo
- Field `delivery.state` cho biết trạng thái
- Field `delivery.error` nếu có lỗi

## Chi phí

**Firebase Extension:** Miễn phí

**Email service:**
- Gmail: Miễn phí (giới hạn ~500 emails/day)
- SendGrid: Free tier 100 emails/day, sau đó $14.95/month cho 40K emails
- AWS SES: $0.10 per 1000 emails

## Best Practices

1. **Production:** Sử dụng SendGrid, Mailgun, hoặc AWS SES thay vì Gmail
2. **Templates:** Cân nhắc sử dụng email templates trong extension config
3. **Monitoring:** Set up alerts cho delivery failures
4. **Testing:** Luôn test với real email address trước khi deploy
5. **Unsubscribe:** Thêm link unsubscribe trong email template
6. **Rate limiting:** Cân nhắc giới hạn số email gửi đi để tránh bị ban

## Tài liệu tham khảo

- [Firebase Trigger Email Extension](https://firebase.google.com/products/extensions/firestore-send-email)
- [Extension Documentation](https://github.com/firebase/extensions/tree/master/firestore-send-email)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Quick Start](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)

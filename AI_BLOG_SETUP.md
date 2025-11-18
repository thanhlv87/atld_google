# 🤖 AI Blog Writer - Hướng dẫn Setup Đơn Giản

## Setup nhanh trong 2 phút

### Bước 1: Lấy Gemini API Key (FREE)

1. Truy cập: **https://aistudio.google.com/app/apikey**
2. Đăng nhập bằng Google Account
3. Click **"Create API Key"**
4. Copy API key (dạng: `AIzaSy...`)

### Bước 2: Paste API Key vào Admin

1. Vào **Admin Page** → **Quản lý Blog**
2. Click **"Viết bằng AI"**
3. Click **"Cài đặt API Key"** (nút màu vàng góc phải)
4. Paste API key vào ô input
5. Click **"Lưu API Key"**
6. ✅ Done! Nút sẽ chuyển sang màu xanh "API Key đã lưu"

---

## Cách sử dụng

### Tạo bài blog với AI:

```
Admin → Quản lý Blog → "Viết bằng AI"
↓
Nhập chủ đề: "Hướng dẫn sử dụng mũ bảo hiểm đúng cách"
↓
Click "Tạo bài viết với AI" → Đợi 10-20s
↓
AI tự động điền form:
  ✓ Tiêu đề (SEO-friendly)
  ✓ Tóm tắt
  ✓ Nội dung (800-1200 từ, HTML)
  ✓ Tags
  ✓ Category
↓
Upload ảnh bìa → Review → Publish!
```

---

## Gợi ý chủ đề có sẵn

Click vào bất kỳ để chọn nhanh:

- Quy định mới về an toàn điện trong công nghiệp
- Cách phòng tránh tai nạn lao động tại công trường xây dựng
- Hướng dẫn sử dụng thiết bị bảo hộ lao động đúng cách
- Nghị định 44/2016 về An toàn vệ sinh lao động
- Kỹ năng sơ cấp cứu cơ bản tại nơi làm việc
- Đánh giá rủi ro an toàn lao động theo ISO 45001
- Phòng cháy chữa cháy trong nhà máy sản xuất
- An toàn hóa chất trong phòng thí nghiệm

---

## Tính năng

✅ **Tạo bài viết hoàn chỉnh** - Từ chủ đề → full blog
✅ **8 gợi ý chủ đề** về An toàn Lao động
✅ **Tùy chỉnh category & keywords**
✅ **Nội dung 800-1200 từ** với HTML formatting
✅ **SEO-friendly** - Title, tags, content tối ưu
✅ **100% miễn phí** - Gemini free tier đủ dùng
✅ **Lưu API key local** - Không cần deploy functions
✅ **Push lên GitHub an toàn** - API key không bị lộ

---

## Chi phí

**Gemini 1.5 Flash (FREE tier):**
- ✅ 15 requests/phút
- ✅ 1,500 requests/ngày
- ✅ 1 triệu tokens/tháng

→ **$0/tháng** nếu viết 1-10 bài/ngày

---

## Bảo mật

- ✅ API key lưu trong **localStorage** của browser
- ✅ Chỉ bạn mới thấy được
- ✅ Không lưu trên server
- ✅ An toàn push lên GitHub (không có API key trong code)

---

## Troubleshooting

### ❌ "Vui lòng nhập API key trước"
→ Click "Cài đặt API Key" và paste key

### ❌ "API key không hợp lệ"
→ Kiểm tra key phải bắt đầu bằng "AIza"

### ⏱️ Mất quá lâu (>30s)
→ Refresh và thử lại (API có thể bận)

### 🔑 Quên API key
→ Vào https://aistudio.google.com/app/apikey để xem lại

---

## Workflow hàng ngày

1. **Mở Admin** → Quản lý Blog → "Viết bằng AI"
2. **Chọn/Nhập chủ đề** → Click "Tạo bài viết với AI"
3. **Đợi 15s** → AI điền toàn bộ form
4. **Upload ảnh bìa** → Review → **Publish**
5. **Done!** 🎉

---

## Không cần Firebase Functions!

Khác với version cũ (dùng Firebase Functions + Secrets), giờ:

- ❌ Không cần deploy functions
- ❌ Không cần setup Firebase secrets
- ❌ Không cần command line
- ✅ Chỉ cần paste API key vào UI
- ✅ Hoạt động ngay lập tức
- ✅ Đơn giản 100x

---

Enjoy! 🚀

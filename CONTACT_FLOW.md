# Luồng Liên Hệ Giữa Khách Hàng và Đối Tác

## Tổng quan

Hệ thống SafetyConnect hoạt động như một **nền tảng kết nối thông minh** giữa:
- **Khách hàng**: Doanh nghiệp/Cá nhân có nhu cầu đào tạo an toàn lao động
- **Đối tác**: Các đơn vị đào tạo, giảng viên, tổ chức cung cấp dịch vụ đào tạo

### ⚠️ Lưu ý quan trọng
- **Khách hàng KHÔNG CẦN đăng nhập** để gửi yêu cầu đào tạo
- **Đối tác PHẢI đăng nhập** để xem thông tin liên hệ của khách hàng
- **Không có tính năng tìm kiếm đối tác** - Hệ thống tự động match và gửi email thông báo

---

## Luồng hoạt động chi tiết

### 📋 Bước 1: Khách hàng gửi yêu cầu đào tạo (KHÔNG CẦN ĐĂNG NHẬP)

#### Khách hàng làm gì?
1. Truy cập trang chủ SafetyConnect
2. Nhấn nút **"Tạo Yêu Cầu Đào Tạo Miễn Phí"** hoặc chọn loại đào tạo cụ thể
3. Điền form với các thông tin:

**Thông tin người liên hệ:**
- Tên người liên hệ
- Email
- Số điện thoại

**Nội dung huấn luyện:**
- Loại đào tạo (An toàn điện, An toàn xây dựng, An toàn hóa chất, v.v.)
- Nhóm đào tạo (Nhóm 1-6)
- Số lượng học viên
- Có thể thêm nhiều nội dung đào tạo khác nhau

**Thông tin chung:**
- Thời gian huấn luyện (VD: 2 ngày)
- Thời điểm huấn luyện (VD: T11/2024)
- Địa điểm huấn luyện
- Mô tả chi tiết yêu cầu

**Tùy chọn:**
- ☑️ Yêu cầu báo giá khẩn cấp (nếu cần trong vòng 7 ngày)
- ☑️ Nhận thông báo qua email khi có báo giá mới

4. Nhấn **"Gửi Yêu Cầu Ngay"**

#### Hệ thống làm gì sau khi nhận yêu cầu?

```typescript
// Bước 1: Lưu yêu cầu vào Firestore
await addDoc(collection(db, 'trainingRequests'), {
  clientName: "Nguyễn Văn A",
  clientEmail: "a@company.com",
  clientPhone: "0901234567",
  trainingDetails: [
    { type: "An toàn điện", group: "Nhóm 1", participants: 20 }
  ],
  location: "Hà Nội",
  createdAt: serverTimestamp(),
  urgent: false
});

// Bước 2: Tìm đối tác phù hợp
const matchingPartners = await findPartnersWithCapabilities([
  "An toàn điện"
]);

// Bước 3: Gửi email thông báo cho các đối tác phù hợp
if (matchingPartners.length > 0) {
  await sendEmail(
    matchingPartners.map(p => p.email),
    "🎯 Yêu cầu đào tạo mới: An toàn điện",
    emailTemplate
  );
}
```

**Kết quả:**
- ✅ Yêu cầu được lưu vào database
- ✅ Email thông báo được gửi đến các đối tác phù hợp
- ✅ Khách hàng nhận thông báo thành công

---

### 🔍 Bước 2: Hệ thống tự động tìm đối tác phù hợp

#### Cơ chế matching thông minh

```typescript
// Query đối tác phù hợp
const partnersQuery = query(
  collection(db, 'partners'),
  where('status', '==', 'approved'),           // Chỉ đối tác đã được duyệt
  where('subscribesToEmails', '==', true)      // Đăng ký nhận email
);

// Lọc theo capabilities
matchingPartners = partners.filter(partner =>
  partner.capabilities.some(cap =>
    trainingTypes.includes(cap)
  )
);
```

**Ví dụ:**
- Yêu cầu: "An toàn điện" + "An toàn xây dựng"
- Đối tác A có capabilities: ["An toàn điện", "Chữa cháy"]
- Đối tác B có capabilities: ["An toàn xây dựng", "Làm việc trên cao"]
- Đối tác C có capabilities: ["An toàn hóa chất"]

→ **Email sẽ gửi cho Đối tác A và B** (vì họ có ít nhất 1 capability khớp)

#### Email thông báo gửi cho đối tác

```html
Subject: 🎯 Yêu cầu đào tạo mới: An toàn điện

Nội dung:
- Loại đào tạo: An toàn điện, Nhóm 1
- Số lượng học viên: 20 người
- Địa điểm: Hà Nội
- Thời điểm: T11/2024
- Thời gian: 2 ngày
- Trạng thái: ⚡ KHẨN CẤP (nếu có)

🔐 Để xem thông tin liên hệ của khách hàng, vui lòng:
1. Đăng nhập vào hệ thống SafetyConnect
2. Vào trang "Yêu Cầu Đào Tạo"
3. Gửi báo giá cho khách hàng
```

---

### 👤 Bước 3: Đối tác đăng nhập và xem yêu cầu

#### Đối tác cần làm gì?

1. **Đăng nhập vào hệ thống** (bắt buộc)
   - Sử dụng Google Account
   - Sau khi đăng nhập lần đầu, tạo hồ sơ đối tác

2. **Đợi admin phê duyệt**
   - Admin kiểm tra năng lực, chứng chỉ
   - Status chuyển từ `pending` → `approved`

3. **Vào trang "Yêu Cầu Đào Tạo"**
   - Xem danh sách tất cả yêu cầu phù hợp với capabilities
   - **Thông tin liên hệ chỉ hiển thị sau khi đăng nhập**

#### Giao diện trang "Yêu Cầu Đào Tạo"

```
┌──────────────────────────────────────────────────┐
│  🔍 Tìm kiếm: [_____________________]           │
│                                                  │
│  Sắp xếp: [Mới nhất ▼]   Lọc: [Bộ lọc nâng cao]│
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  ⚡ KHẨN CẤP                                     │
│  📍 Hà Nội • 👥 20 học viên • 📅 T11/2024        │
│                                                  │
│  🎯 Nội dung đào tạo:                            │
│  • An toàn điện - Nhóm 1 (20 người)              │
│                                                  │
│  📝 Mô tả: Cần đào tạo gấp cho công nhân...      │
│                                                  │
│  👤 Thông tin liên hệ:                           │
│     📧 Email: nguyenvana@company.com             │
│     📞 SĐT: 0901234567                           │
│     👔 Tên: Nguyễn Văn A                         │
│                                                  │
│  [💰 Gửi Báo Giá]  [💬 Nhắn tin]                 │
└──────────────────────────────────────────────────┘
```

**Tính năng tìm kiếm & lọc:**
- ✅ Tìm kiếm theo từ khóa (địa điểm, mô tả, loại đào tạo)
- ✅ Bộ lọc nâng cao:
  - Loại đào tạo
  - Tỉnh/Thành phố
  - Số lượng học viên (min-max)
  - Chỉ yêu cầu khẩn cấp
  - Khoảng thời gian
- ✅ Sắp xếp:
  - Mới nhất
  - Số lượng học viên (nhiều nhất)
  - Thời điểm sớm nhất

---

### 💰 Bước 4: Đối tác gửi báo giá

#### Đối tác nhấn "Gửi Báo Giá"

Form báo giá bao gồm:
- Chi phí (VND)
- Lịch trình đề xuất
- Giảng viên
- File đính kèm (hợp đồng, brochure, chứng chỉ)
- Ghi chú

```typescript
await addDoc(collection(db, 'quotes'), {
  requestId: "yeu-cau-123",
  partnerId: user.uid,
  partnerName: "Công ty TNHH Đào tạo ABC",
  cost: 15000000,
  schedule: "2 ngày (T11/15-16/2024)",
  trainer: "Lê Thanh (aka August87)",
  attachments: ["contract.pdf"],
  note: "Chúng tôi cam kết chất lượng...",
  createdAt: serverTimestamp()
});
```

**Sau khi gửi báo giá:**
1. Báo giá được lưu vào database
2. Hệ thống gửi email thông báo cho khách hàng (nếu khách hàng đăng ký nhận email)
3. Tự động tạo phòng chat giữa khách hàng và đối tác

---

### 💬 Bước 5: Chat trực tiếp (Sau khi có báo giá)

#### Khi nào phòng chat được tạo?
- Tự động tạo sau khi đối tác gửi báo giá lần đầu
- 1 yêu cầu đào tạo + 1 đối tác = 1 phòng chat

#### Ai có thể chat?
- **Khách hàng**: Cần đăng nhập (nếu muốn chat)
- **Đối tác**: Đã đăng nhập sẵn
- **Admin**: Có thể xem tất cả cuộc chat

**Lưu ý:**
- Khách hàng KHÔNG BẮT BUỘC phải đăng nhập để nhận báo giá (qua email)
- Nhưng NẾU muốn chat trực tiếp với đối tác, cần đăng nhập

#### Luồng chat

```
Khách hàng                    Đối tác
    │                            │
    │  "Cho tôi xem CV giảng viên" │
    │───────────────────────────>│
    │                            │
    │     "Đây là CV của GV..."  │
    │<───────────────────────────│
    │                            │
    │  "Giá có thương lượng không?" │
    │───────────────────────────>│
    │                            │
    │     "Vâng, giảm 10%..."   │
    │<───────────────────────────│
```

---

## So sánh với các nền tảng khác

| Tính năng | SafetyConnect | Upwork/Fiverr | Facebook Groups |
|-----------|--------------|---------------|-----------------|
| Khách hàng cần đăng nhập? | ❌ KHÔNG | ✅ Có | ✅ Có |
| Đối tác cần đăng nhập? | ✅ Có | ✅ Có | ✅ Có |
| Tự động match? | ✅ Có | ❌ Không | ❌ Không |
| Gửi email thông báo? | ✅ Có | ✅ Có | ❌ Không |
| Bảo mật thông tin liên hệ? | ✅ Có | ✅ Có | ❌ Không |
| Chat trực tiếp? | ✅ Có | ✅ Có | ✅ Có |

---

## Ưu điểm của mô hình này

### ✅ Cho Khách hàng
1. **Không cần đăng nhập** - Đơn giản, nhanh chóng
2. **Nhận nhiều báo giá** - Từ nhiều đối tác phù hợp
3. **Thông tin được bảo mật** - Chỉ đối tác đã đăng nhập mới thấy
4. **Nhận thông báo qua email** - Không cần vào web liên tục
5. **Miễn phí 100%** - Không tốn chi phí đăng yêu cầu

### ✅ Cho Đối tác
1. **Nhận thông báo tự động** - Qua email khi có yêu cầu phù hợp
2. **Không mất thời gian tìm kiếm** - Hệ thống tự match
3. **Cạnh tranh công bằng** - Chỉ đối tác có capabilities phù hợp mới nhận thông báo
4. **Quản lý tập trung** - Tất cả yêu cầu, báo giá, chat ở một nơi
5. **Tăng uy tín** - Được admin phê duyệt trước khi tham gia

### ✅ Cho Admin/Platform
1. **Kiểm soát chất lượng** - Phê duyệt đối tác trước khi cho vào hệ thống
2. **Giám sát hoạt động** - Xem tất cả yêu cầu, báo giá, chat
3. **Dữ liệu phân tích** - Thống kê loại đào tạo nào hot, khu vực nào nhiều nhu cầu
4. **Can thiệp khi cần** - Hỗ trợ giải quyết tranh chấp

---

## Câu hỏi thường gặp (FAQ)

### Q: Khách hàng có PHẢI đăng nhập không?
**A:** KHÔNG. Khách hàng chỉ cần điền form và gửi yêu cầu. Tuy nhiên, nếu muốn chat trực tiếp với đối tác, cần đăng nhập.

### Q: Tại sao không có tính năng tìm kiếm đối tác?
**A:** Vì hệ thống tự động match và gửi email cho các đối tác phù hợp. Khách hàng không cần tự tìm, chỉ cần chờ nhận báo giá.

### Q: Đối tác có thể xem thông tin liên hệ ngay không?
**A:** Có, sau khi đăng nhập và được admin phê duyệt, đối tác có thể xem đầy đủ thông tin liên hệ của khách hàng.

### Q: Nếu không có đối tác nào phù hợp thì sao?
**A:** Yêu cầu vẫn được lưu vào hệ thống. Khi có đối tác mới đăng ký với capabilities phù hợp, admin có thể thông báo cho họ.

### Q: Khách hàng có thể chọn đối tác cụ thể không?
**A:** Không trực tiếp. Nhưng khách hàng có thể ghi rõ trong mô tả (VD: "yêu cầu giảng viên Lê Thanh aka August87").

### Q: Phí dịch vụ bao nhiêu?
**A:** Hiện tại miễn phí cho cả khách hàng và đối tác. Platform có thể thu phí hoa hồng từ đối tác trong tương lai.

---

## Tóm tắt luồng hoạt động

```
1. Khách hàng (ko đăng nhập)
   └─> Gửi yêu cầu đào tạo
       └─> Lưu vào Firestore
           └─> Hệ thống tự động tìm đối tác phù hợp
               └─> Gửi email cho đối tác

2. Đối tác (đã đăng nhập + approved)
   └─> Nhận email thông báo
       └─> Vào trang "Yêu Cầu Đào Tạo"
           └─> Xem thông tin liên hệ đầy đủ
               └─> Gửi báo giá
                   └─> Tạo phòng chat tự động

3. Chat (cả 2 bên đăng nhập)
   └─> Trao đổi chi tiết
       └─> Thỏa thuận hợp đồng
           └─> Ký kết ngoài hệ thống
```

---

## Kết luận

Mô hình này tối ưu hóa trải nghiệm cho cả khách hàng và đối tác:
- **Khách hàng**: Đơn giản, nhanh chóng, không cần đăng nhập
- **Đối tác**: Nhận thông báo tự động, tiếp cận khách hàng tiềm năng
- **Platform**: Kiểm soát chất lượng, thu thập dữ liệu, tạo giá trị

Đây là mô hình **marketplace B2B** hiện đại, phù hợp với ngành đào tạo an toàn lao động.

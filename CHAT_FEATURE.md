# Tính năng Tin nhắn (Chat)

## Tổng quan

Hệ thống tin nhắn cho phép **Khách hàng**, **Đối tác đào tạo** và **Admin** trao đổi trực tiếp về các yêu cầu đào tạo an toàn lao động.

## Kiến trúc

### Collections trong Firestore

#### 1. `chatRooms` - Phòng chat

Mỗi phòng chat đại diện cho một cuộc trao đổi giữa khách hàng và đối tác về một yêu cầu đào tạo cụ thể.

**Cấu trúc dữ liệu:**

```typescript
{
  id: string;
  requestId: string; // ID của yêu cầu đào tạo
  clientId: string; // UID của khách hàng
  clientName: string; // Tên khách hàng
  partnerId: string; // UID của đối tác
  partnerName: string; // Tên đối tác
  lastMessage: string; // Tin nhắn cuối cùng
  lastMessageTime: Timestamp;
  unreadCount: {
    client: number; // Số tin chưa đọc của khách hàng
    partner: number; // Số tin chưa đọc của đối tác
  }
}
```

#### 2. `chatMessages` - Tin nhắn

Lưu trữ tất cả tin nhắn trong các phòng chat.

**Cấu trúc dữ liệu:**

```typescript
{
  id: string;
  roomId: string; // ID của phòng chat
  senderId: string; // UID người gửi
  senderName: string; // Tên người gửi
  senderRole: 'client' | 'partner' | 'admin';
  message: string; // Nội dung tin nhắn
  read: boolean; // Đã đọc chưa
  createdAt: Timestamp;
}
```

## Phân quyền (Firestore Rules)

### Chat Rooms

```javascript
match /chatRooms/{roomId} {
  // Chỉ người tham gia (client, partner) hoặc admin mới đọc được
  allow read: if isAuthenticated() &&
              (resource.data.clientId == request.auth.uid ||
               resource.data.partnerId == request.auth.uid ||
               isAdmin());

  // Người đã đăng nhập có thể tạo phòng chat
  allow create: if isAuthenticated();

  // Người tham gia có thể update (lastMessage, unreadCount)
  allow update: if isAuthenticated() &&
                (resource.data.clientId == request.auth.uid ||
                 resource.data.partnerId == request.auth.uid ||
                 isAdmin());

  // Chỉ admin có thể xóa
  allow delete: if isAdmin();
}
```

### Chat Messages

```javascript
match /chatMessages/{messageId} {
  // Người đã đăng nhập có thể đọc tin nhắn
  allow read: if isAuthenticated();

  // Chỉ được tạo tin nhắn nếu senderId = uid của mình
  allow create: if isAuthenticated() &&
                request.resource.data.senderId == request.auth.uid;

  // Người đã đăng nhập có thể update (đánh dấu đã đọc)
  allow update: if isAuthenticated();

  // Chỉ admin có thể xóa
  allow delete: if isAdmin();
}
```

## Luồng hoạt động

### 1. Khách hàng (Client)

1. Gửi yêu cầu đào tạo từ trang chủ
2. Đối tác phê duyệt → Tạo phòng chat tự động
3. Vào trang "Tin nhắn" để xem danh sách các cuộc trao đổi
4. Chọn phòng chat → Gửi/nhận tin nhắn với đối tác

**Query:**

```typescript
query(
  collection(db, 'chatRooms'),
  where('clientId', '==', user.uid),
  orderBy('lastMessageTime', 'desc')
);
```

### 2. Đối tác (Partner - Approved)

1. Nhận yêu cầu đào tạo từ khách hàng
2. Phê duyệt yêu cầu → Hệ thống tự động tạo phòng chat
3. Vào trang "Tin nhắn" để trao đổi với khách hàng
4. Gửi báo giá, thông tin khóa học qua chat

**Query:**

```typescript
query(
  collection(db, 'chatRooms'),
  where('partnerId', '==', user.uid),
  orderBy('lastMessageTime', 'desc')
);
```

### 3. Admin

1. Xem tất cả các cuộc trò chuyện trong hệ thống
2. Can thiệp khi cần hỗ trợ
3. Theo dõi hoạt động giao tiếp giữa khách hàng và đối tác

**Query:**

```typescript
query(collection(db, 'chatRooms'), orderBy('lastMessageTime', 'desc'));
```

## Tính năng chính

### ✅ Real-time messaging

- Sử dụng Firestore `onSnapshot()` để cập nhật tin nhắn thời gian thực
- Không cần refresh trang, tin nhắn mới tự động hiển thị

### ✅ Unread count (Đếm tin chưa đọc)

- Hiển thị badge đỏ với số tin nhắn chưa đọc
- Tự động reset khi mở phòng chat

### ✅ Read receipts (Xác nhận đã đọc)

- Icon check double (✓✓) màu xanh khi tin nhắn đã được đọc
- Tự động đánh dấu `read: true` khi người nhận xem tin nhắn

### ✅ Auto-scroll

- Tự động cuộn xuống tin nhắn mới nhất
- Smooth scrolling animation

### ✅ Responsive design

- Giao diện 2 cột trên desktop (danh sách + cửa sổ chat)
- Giao diện 1 cột trên mobile
- Sử dụng Tailwind CSS

### ✅ Role-based display

- Admin: Hiển thị badge "Admin" màu đỏ
- Khách hàng: Thấy tên đối tác
- Đối tác: Thấy tên khách hàng

## Components

### 1. ChatPage.tsx

- Component chính quản lý trang chat
- Xác định role của user (client/partner/admin)
- Query danh sách phòng chat dựa trên role
- Layout 2 cột: ChatList + ChatWindow

### 2. ChatList.tsx

- Hiển thị danh sách các phòng chat
- Sắp xếp theo thời gian tin nhắn cuối
- Hiển thị:
  - Avatar tên người chat
  - Tin nhắn cuối cùng (truncated)
  - Thời gian (relative: "2h", "3d")
  - Badge số tin chưa đọc

### 3. ChatWindow.tsx

- Cửa sổ chat chính
- Hiển thị header với thông tin người chat
- Danh sách tin nhắn (tin của mình bên phải, tin người khác bên trái)
- Input gửi tin nhắn với nút gửi
- Tự động scroll xuống tin mới

## UI/UX Features

### Color scheme

- Primary gradient: `from-primary to-orange-500`
- Tin nhắn của mình: Gradient primary
- Tin nhắn người khác: Gray background
- Unread badge: Red (#ef4444)

### Animations

- Smooth scroll to bottom
- Hover effects on chat items
- Loading spinners
- Transition colors

### Icons (Font Awesome)

- 💬 `fa-comments`: Icon chat
- 📧 `fa-paper-plane`: Gửi tin nhắn
- ✓✓ `fa-check-double`: Đã đọc
- 📥 `fa-inbox`: Không có tin nhắn

## Cách sử dụng

### Cho Khách hàng:

1. Đăng nhập vào hệ thống
2. Click menu "Tin nhắn"
3. Chọn cuộc trò chuyện với đối tác
4. Gửi câu hỏi, yêu cầu thông tin
5. Nhận báo giá và trao đổi chi tiết khóa học

### Cho Đối tác:

1. Đăng nhập với tài khoản đã được phê duyệt
2. Vào "Tin nhắn" để xem các yêu cầu
3. Trao đổi với khách hàng về nội dung đào tạo
4. Gửi báo giá, lịch trình, thông tin chi tiết

### Cho Admin:

1. Đăng nhập với quyền admin
2. Xem tất cả các cuộc trò chuyện
3. Giám sát chất lượng dịch vụ
4. Can thiệp khi cần thiết

## Indexes cần thiết trong Firestore

```javascript
// chatRooms
{
  collectionGroup: "chatRooms",
  queryScope: "COLLECTION",
  fields: [
    { fieldPath: "clientId", order: "ASCENDING" },
    { fieldPath: "lastMessageTime", order: "DESCENDING" }
  ]
}

{
  collectionGroup: "chatRooms",
  queryScope: "COLLECTION",
  fields: [
    { fieldPath: "partnerId", order: "ASCENDING" },
    { fieldPath: "lastMessageTime", order: "DESCENDING" }
  ]
}

// chatMessages
{
  collectionGroup: "chatMessages",
  queryScope: "COLLECTION",
  fields: [
    { fieldPath: "roomId", order: "ASCENDING" },
    { fieldPath: "createdAt", order: "ASCENDING" }
  ]
}
```

## Tối ưu hóa và Cải tiến tương lai

### Có thể thêm:

- ✨ Gửi file đính kèm (hợp đồng, tài liệu)
- ✨ Typing indicator (đang nhập...)
- ✨ Push notifications (thông báo tin nhắn mới)
- ✨ Emoji reactions
- ✨ Message search (tìm kiếm tin nhắn)
- ✨ Group chat (nhóm chat nhiều người)
- ✨ Voice messages (tin nhắn thoại)
- ✨ Video call integration

### Bảo mật:

- ✅ Firestore rules đảm bảo chỉ người liên quan mới đọc được
- ✅ Validate senderId khi tạo tin nhắn
- ✅ Admin có quyền xem mọi cuộc trò chuyện để giám sát

### Performance:

- ✅ Query có index tối ưu
- ✅ Real-time updates không polling
- ✅ Lazy loading tin nhắn cũ (có thể cải tiến thêm)

## Kết luận

Tính năng chat đã hoàn chỉnh và sẵn sàng sử dụng, giúp kết nối khách hàng và đối tác một cách hiệu quả, minh bạch và chuyên nghiệp.

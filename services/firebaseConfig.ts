import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

/*
 * ==========================================================================
 * ==========================================================================
 * 
 *    🔥🔥🔥 HÀNH ĐỘNG BẮT BUỘC: CẤU HÌNH FIREBASE CỦA BẠN 🔥🔥🔥
 * 
 *    Lỗi bạn đang thấy là một biện pháp bảo vệ. Ứng dụng sẽ không hoạt động
 *    cho đến khi bạn cung cấp thông tin xác thực Firebase của riêng mình.
 *
 *    LÀM THEO CÁC BƯỚC SAU:
 *    1. Mở trang Firebase Console: https://console.firebase.google.com/
 *    2. Chọn hoặc tạo dự án của bạn.
 *    3. Đi tới "Project Settings" (biểu tượng bánh răng ⚙️) -> tab "General".
 *    4. Tìm phần "Your apps" và chọn ứng dụng web của bạn (hoặc tạo một cái mới).
 *    5. Sao chép đối tượng `firebaseConfig` và THAY THẾ TOÀN BỘ đối tượng
 *       `firebaseConfig` ở bên dưới bằng thông tin của bạn.
 * 
 * ==========================================================================
 * ==========================================================================
 */
const firebaseConfig = {
    apiKey: "AIzaSyBE31B4fcR9GDgqqUWagySl2KSG3nyl64E",
  authDomain: "atld-connect.firebaseapp.com",
  projectId: "atld-connect",
  storageBucket: "atld-connect.appspot.com",
  messagingSenderId: "745800129021",
  appId: "1:745800129021:web:8b37c115c4327930dc6194"
};

// Kiểm tra xem cấu hình đã được thay đổi chưa. Nếu chưa, ứng dụng sẽ dừng lại
// và hiển thị lỗi rõ ràng trong console thay vì bị "đơ".
if (firebaseConfig.apiKey === "PASTE_YOUR_API_KEY_HERE") {
    throw new Error("Lỗi cấu hình Firebase: Vui lòng cập nhật thông tin trong file `services/firebaseConfig.ts` theo hướng dẫn.");
}


// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase };
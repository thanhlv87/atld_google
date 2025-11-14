import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from '../services/firebaseConfig';
import { TrainingRequest } from '../types';

/**
 * Tạo hoặc lấy phòng chat giữa đối tác và admin cho một yêu cầu cụ thể
 * @param request - Yêu cầu đào tạo
 * @param partnerId - UID của đối tác
 * @param partnerName - Tên đối tác
 * @param partnerEmail - Email đối tác
 * @returns ID của phòng chat
 */
export const getOrCreateAdminPartnerChatRoom = async (
  request: TrainingRequest,
  partnerId: string,
  partnerName: string,
  partnerEmail: string
): Promise<string> => {
  const chatRoomsRef = collection(db, 'chatRooms');

  // Kiểm tra xem đã có phòng chat cho request này chưa
  const q = query(
    chatRoomsRef,
    where('requestId', '==', request.id),
    where('partnerId', '==', partnerId)
  );
  const existingRooms = await getDocs(q);

  if (!existingRooms.empty) {
    // Phòng chat đã tồn tại
    return existingRooms.docs[0].id;
  }

  // Tạo phòng chat mới
  // Client sẽ là "admin" (placeholder), partner là đối tác thật
  const roomData = {
    requestId: request.id,
    clientId: 'admin', // Special ID cho admin
    clientName: 'Admin - SafetyConnect',
    clientEmail: 'admin@safetyconnect.vn',
    partnerId: partnerId,
    partnerName: partnerName,
    partnerEmail: partnerEmail,
    lastMessage: 'Phòng chat đã được tạo',
    lastMessageTime: serverTimestamp(),
    unreadCount: {
      client: 0, // Admin
      partner: 0
    },
    createdAt: serverTimestamp()
  };

  const roomRef = await addDoc(chatRoomsRef, roomData);
  console.log('✅ Phòng chat admin-partner đã được tạo:', roomRef.id);

  // Gửi tin nhắn đầu tiên
  await addDoc(collection(db, 'chatMessages'), {
    roomId: roomRef.id,
    senderId: 'system',
    senderName: 'Hệ thống',
    senderRole: 'admin',
    message: `Phòng chat đã được tạo cho yêu cầu: ${request.trainingDetails.map(d => d.type).join(', ')}. Admin sẽ hỗ trợ bạn trong quá trình báo giá.`,
    read: false,
    createdAt: serverTimestamp()
  });

  return roomRef.id;
};

/**
 * Tạo tin nhắn thông báo báo giá mới cho admin
 */
export const sendQuoteNotificationToAdminChat = async (
  roomId: string,
  partnerId: string,
  partnerName: string,
  price: number
) => {
  await addDoc(collection(db, 'chatMessages'), {
    roomId: roomId,
    senderId: partnerId,
    senderName: partnerName,
    senderRole: 'partner',
    message: `Tôi đã gửi báo giá ${price.toLocaleString('vi-VN')} VND cho yêu cầu này. Nếu có thắc mắc gì, mong admin hỗ trợ.`,
    read: false,
    createdAt: serverTimestamp()
  });
};

import React, { useState, useEffect, useRef } from 'react';
import {
  db,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  type User
} from '../services/firebaseConfig';
import { ChatMessage, ChatRoom } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ChatWindowProps {
  room: ChatRoom;
  currentUser: User;
  userRole: 'client' | 'partner' | 'admin';
  userName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ room, currentUser, userRole, userName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!room?.id) return;

    const messagesCollection = collection(db, 'chatMessages');
    const q = query(
      messagesCollection,
      where('roomId', '==', room.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage));
      setMessages(messagesData);
      setLoading(false);

      // Mark messages as read
      messagesData.forEach(async (msg) => {
        if (msg.senderId !== currentUser.uid && !msg.read) {
          const msgRef = doc(db, 'chatMessages', msg.id);
          await updateDoc(msgRef, { read: true });
        }
      });

      // Scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [room?.id, currentUser.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      // Add message to chatMessages collection
      await addDoc(collection(db, 'chatMessages'), {
        roomId: room.id,
        senderId: currentUser.uid,
        senderName: userName,
        senderRole: userRole,
        message: newMessage.trim(),
        read: false,
        createdAt: serverTimestamp()
      });

      // Update room's last message
      const roomRef = doc(db, 'chatRooms', room.id);
      const unreadField = userRole === 'client' ? 'unreadCount.partner' : 'unreadCount.client';
      await updateDoc(roomRef, {
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
        [unreadField]: (userRole === 'client' ? room.unreadCount.partner : room.unreadCount.client) + 1
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-4 rounded-t-lg">
        <h3 className="font-bold text-lg">
          {userRole === 'partner' ? room.clientName : room.partnerName}
        </h3>
        <p className="text-sm text-white/80">
          Yêu cầu đào tạo #{room.requestId.slice(0, 8)}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <i className="fas fa-comments text-4xl mb-3"></i>
            <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUser.uid;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  {!isOwn && (
                    <p className="text-xs text-gray-500 mb-1 px-3">
                      {msg.senderName}
                      {msg.senderRole === 'admin' && (
                        <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">
                          Admin
                        </span>
                      )}
                    </p>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary to-orange-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 px-3 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.createdAt)}
                    {isOwn && msg.read && <i className="fas fa-check-double ml-1 text-blue-500"></i>}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <LoadingSpinner size="small" />
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

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
  getDoc,
  serverTimestamp,
  Timestamp,
  type User
} from '../services/firebaseConfig';
import { ChatMessage, ChatRoom, TrainingRequest } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { uploadFile, validateFile, getFileType, formatFileSize } from '../utils/fileUpload';

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
  const [request, setRequest] = useState<TrainingRequest | null>(null);
  const [showRequestCard, setShowRequestCard] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch training request
  useEffect(() => {
    const fetchRequest = async () => {
      if (!room.requestId) return;

      try {
        const requestRef = doc(db, 'trainingRequests', room.requestId);
        const requestDoc = await getDoc(requestRef);

        if (requestDoc.exists()) {
          setRequest({ id: requestDoc.id, ...requestDoc.data() } as TrainingRequest);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      }
    };

    fetchRequest();
  }, [room.requestId]);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      alert(error);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || sending) return;

    setSending(true);
    setUploading(!!selectedFile);

    try {
      let attachment = undefined;

      // Upload file if selected
      if (selectedFile) {
        const downloadURL = await uploadFile(selectedFile, 'chat-attachments', currentUser.uid);
        attachment = {
          url: downloadURL,
          name: selectedFile.name,
          type: getFileType(selectedFile.type),
          size: selectedFile.size
        };
      }

      const messageText = newMessage.trim() || (selectedFile ? `📎 ${selectedFile.name}` : '');

      // Add message to chatMessages collection
      await addDoc(collection(db, 'chatMessages'), {
        roomId: room.id,
        senderId: currentUser.uid,
        senderName: userName,
        senderRole: userRole,
        message: messageText,
        read: false,
        createdAt: serverTimestamp(),
        ...(attachment && { attachment })
      });

      // Update room's last message
      const roomRef = doc(db, 'chatRooms', room.id);
      const unreadField = userRole === 'client' ? 'unreadCount.partner' : 'unreadCount.client';
      await updateDoc(roomRef, {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        [unreadField]: (userRole === 'client' ? room.unreadCount.partner : room.unreadCount.client) + 1
      });

      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
      setUploading(false);
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">
              {userRole === 'partner' ? room.clientName : room.partnerName}
            </h3>
            <p className="text-sm text-white/80">
              Yêu cầu đào tạo #{room.requestId.slice(0, 8)}
            </p>
          </div>
          {request && (
            <button
              onClick={() => setShowRequestCard(!showRequestCard)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              title={showRequestCard ? 'Ẩn chi tiết yêu cầu' : 'Hiển thị chi tiết yêu cầu'}
            >
              <i className={`fas ${showRequestCard ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          )}
        </div>
      </div>

      {/* Request Preview Card */}
      {request && showRequestCard && (
        <div className="flex-shrink-0 bg-blue-50 border-b border-blue-200 p-4 max-h-[40vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-clipboard-list text-primary"></i>
              Chi Tiết Yêu Cầu
            </h4>
            <button
              onClick={() => setShowRequestCard(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Đóng"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
            {/* Training Details */}
            <div>
              <span className="font-semibold text-gray-700">Nội dung đào tạo:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {request.trainingDetails.map((detail, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {detail.type} - {detail.group} ({detail.participants} người)
                  </span>
                ))}
              </div>
            </div>

            {/* Location & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold text-gray-700">
                  <i className="fas fa-map-marker-alt text-primary mr-1"></i>
                  Địa điểm:
                </span>
                <p className="text-gray-600">{request.location}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  <i className="fas fa-calendar text-primary mr-1"></i>
                  Thời điểm:
                </span>
                <p className="text-gray-600">{request.preferredTime}</p>
              </div>
            </div>

            {/* Duration */}
            <div>
              <span className="font-semibold text-gray-700">
                <i className="fas fa-clock text-primary mr-1"></i>
                Thời gian:
              </span>
              <span className="text-gray-600 ml-1">{request.trainingDuration}</span>
            </div>

            {/* Description */}
            {request.description && (
              <div>
                <span className="font-semibold text-gray-700">
                  <i className="fas fa-info-circle text-primary mr-1"></i>
                  Mô tả:
                </span>
                <p className="text-gray-600 mt-1 italic">{request.description}</p>
              </div>
            )}

            {/* Contact Info (only for admin/partner) */}
            {(userRole === 'admin' || userRole === 'partner') && (
              <div className="pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-700">
                  <i className="fas fa-user text-primary mr-1"></i>
                  Thông tin liên hệ:
                </span>
                <div className="mt-1 text-gray-600">
                  <p>📧 {request.clientEmail}</p>
                  <p>📞 {request.clientPhone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
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
                    {msg.attachment && (
                      <div className="mb-2">
                        {msg.attachment.type === 'image' ? (
                          <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              className="max-w-full rounded-lg max-h-64 object-contain cursor-pointer hover:opacity-90"
                            />
                          </a>
                        ) : (
                          <a
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded ${
                              isOwn ? 'bg-white/20' : 'bg-gray-200'
                            } hover:opacity-80 transition-opacity`}
                          >
                            <i className={`fas ${
                              msg.attachment.type === 'pdf' ? 'fa-file-pdf text-red-500' : 'fa-file text-blue-500'
                            } text-2xl`}></i>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-800'}`}>
                                {msg.attachment.name}
                              </p>
                              <p className={`text-xs ${isOwn ? 'text-white/80' : 'text-gray-500'}`}>
                                {formatFileSize(msg.attachment.size)}
                              </p>
                            </div>
                            <i className={`fas fa-download ${isOwn ? 'text-white' : 'text-gray-600'}`}></i>
                          </a>
                        )}
                      </div>
                    )}
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
      <form onSubmit={handleSendMessage} className="flex-shrink-0 border-t p-4 bg-gray-50">
        {/* File preview */}
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <i className={`fas ${
              selectedFile.type.startsWith('image/') ? 'fa-image' :
              selectedFile.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file'
            } text-blue-500`}></i>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700 transition-colors"
              disabled={sending}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileSelect}
            className="hidden"
            disabled={sending}
          />

          {/* File upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-600 hover:text-primary px-3 py-3 rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={sending || uploading}
            title="Đính kèm file"
          >
            <i className="fas fa-paperclip text-xl"></i>
          </button>

          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={uploading ? "Đang tải file..." : "Nhập tin nhắn..."}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={sending}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={(!newMessage.trim() && !selectedFile) || sending}
            className="bg-gradient-to-r from-primary to-orange-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <LoadingSpinner size="small" />
            ) : uploading ? (
              <i className="fas fa-spinner fa-spin"></i>
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

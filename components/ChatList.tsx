import React from 'react';
import { ChatRoom } from '../types';
import { Timestamp } from '../services/firebaseConfig';

interface ChatListProps {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (room: ChatRoom) => void;
  userRole: 'client' | 'partner' | 'admin';
}

const ChatList: React.FC<ChatListProps> = ({ rooms, selectedRoomId, onSelectRoom, userRole }) => {
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes}p`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
        <i className="fas fa-inbox text-5xl mb-3"></i>
        <p className="text-center">Chưa có cuộc trò chuyện nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {rooms.map((room) => {
        const isSelected = room.id === selectedRoomId;
        const unreadCount = userRole === 'client' ? room.unreadCount.client : room.unreadCount.partner;
        const displayName = userRole === 'partner' ? room.clientName : room.partnerName;

        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room)}
            className={`w-full text-left px-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{displayName}</h4>
                  <p className="text-sm text-gray-500 truncate">
                    {truncateMessage(room.lastMessage)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end ml-2 flex-shrink-0">
                <span className="text-xs text-gray-400 mb-1">
                  {formatTime(room.lastMessageTime)}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChatList;

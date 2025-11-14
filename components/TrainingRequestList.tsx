import React from 'react';
import { type User } from '../services/firebaseConfig';
import { TrainingRequest } from '../types';
import TrainingRequestCard from './TrainingRequestCard';
import { PartnerStatus } from '../App';

interface TrainingRequestListProps {
  requests: TrainingRequest[];
  user: User | null;
  loading: boolean;
  onLoginRequired: () => void;
  partnerStatus: PartnerStatus;
  searchQuery?: string;
  onChatClick?: (request: TrainingRequest) => void;
}

const TrainingRequestList: React.FC<TrainingRequestListProps> = ({ requests, user, loading, onLoginRequired, partnerStatus, searchQuery, onChatClick }) => {
  const hasActiveSearch = searchQuery && searchQuery.trim() !== '';

  return (
    <div>
      {loading ? (
        <div className="text-center py-10">
          <p className="text-neutral-dark">Đang tải dữ liệu...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {requests.map(request => (
            <TrainingRequestCard
              key={request.id}
              request={request}
              user={user}
              onLoginRequired={onLoginRequired}
              partnerStatus={partnerStatus}
              onChatClick={onChatClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md border">
          {hasActiveSearch ? (
             <p className="text-neutral-dark">Không tìm thấy yêu cầu nào phù hợp với tìm kiếm của bạn.</p>
          ) : (
             <p className="text-neutral-dark">Chưa có yêu cầu nào được tạo. Hãy là người đầu tiên!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainingRequestList;
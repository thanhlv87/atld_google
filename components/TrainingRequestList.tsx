import React from 'react';
import { firebase } from '../services/firebaseConfig';
import { TrainingRequest } from '../types';
import TrainingRequestCard from './TrainingRequestCard';
import { PartnerStatus } from '../App';

interface TrainingRequestListProps {
  requests: TrainingRequest[];
  user: firebase.User | null;
  loading: boolean;
  onLoginRequired: () => void;
  partnerStatus: PartnerStatus;
}

const TrainingRequestList: React.FC<TrainingRequestListProps> = ({ requests, user, loading, onLoginRequired, partnerStatus }) => {
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md border">
          <p className="text-neutral-dark">Chưa có yêu cầu nào được tạo. Hãy là người đầu tiên!</p>
        </div>
      )}
    </div>
  );
};

export default TrainingRequestList;

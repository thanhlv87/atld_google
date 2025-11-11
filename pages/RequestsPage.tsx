import React from 'react';
import { firebase } from '../services/firebaseConfig';
import { TrainingRequest } from '../types';
import TrainingRequestList from '../components/TrainingRequestList';
import { PartnerStatus } from '../App';

interface RequestsPageProps {
  requests: TrainingRequest[];
  user: firebase.User | null;
  loading: boolean;
  onLoginRequired: () => void;
  partnerStatus: PartnerStatus;
}

const RequestsPage: React.FC<RequestsPageProps> = ({ requests, user, loading, onLoginRequired, partnerStatus }) => {
  const showPendingBanner = user && partnerStatus === 'pending';
  const showRejectedBanner = user && partnerStatus === 'rejected';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-2">
              Danh Sách Yêu Cầu Huấn Luyện
          </h1>
          <p className="text-gray-600">
              Tất cả các nhu cầu huấn luyện mới nhất được cập nhật tại đây.
          </p>
      </div>

      {showPendingBanner && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">Tài khoản đang chờ phê duyệt</p>
          <p>Bạn có thể xem danh sách các yêu cầu, nhưng cần được phê duyệt để xem thông tin liên hệ chi tiết và báo giá.</p>
        </div>
      )}
      
      {showRejectedBanner && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">Hồ sơ chưa được duyệt</p>
          <p>Rất tiếc, hồ sơ của bạn chưa được phê duyệt. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.</p>
        </div>
      )}

      <TrainingRequestList 
        requests={requests}
        user={user} 
        loading={loading}
        onLoginRequired={onLoginRequired}
        partnerStatus={partnerStatus}
      />
    </div>
  );
};

export default RequestsPage;
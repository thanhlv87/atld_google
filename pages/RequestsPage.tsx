import React, { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const showPendingBanner = user && partnerStatus === 'pending';
  const showRejectedBanner = user && partnerStatus === 'rejected';

  // Helper function to parse varied date strings like "T11/2024", "Tháng 12 2024"
  const parsePreferredTime = (timeStr: string): Date | null => {
      if (!timeStr) return null;
      const match = timeStr.match(/(?:T|Tháng)?\s*(\d{1,2})[/\s.,-]+(\d{4})/);
      if (match) {
          const month = parseInt(match[1], 10);
          const year = parseInt(match[2], 10);
          if (month >= 1 && month <= 12) {
              // Set to the first day of the month for consistent sorting
              return new Date(year, month - 1, 1);
          }
      }
      return null;
  };

  const filteredAndSortedRequests = useMemo(() => {
    let processedRequests = [...requests];

    // 1. Filtering by search query
    if (searchQuery.trim()) {
        const lowercasedQuery = searchQuery.toLowerCase();
        processedRequests = processedRequests.filter(req => {
            const locationMatch = req.location.toLowerCase().includes(lowercasedQuery);
            const descriptionMatch = req.description.toLowerCase().includes(lowercasedQuery);
            const typesMatch = req.trainingDetails?.some(detail => detail.type.toLowerCase().includes(lowercasedQuery)) || false;
            return locationMatch || descriptionMatch || typesMatch;
        });
    }

    // 2. Sorting
    switch (sortBy) {
        case 'participants':
            processedRequests.sort((a, b) => {
                const totalA = a.trainingDetails?.reduce((sum, d) => sum + d.participants, 0) || 0;
                const totalB = b.trainingDetails?.reduce((sum, d) => sum + d.participants, 0) || 0;
                return totalB - totalA;
            });
            break;
        case 'soonest':
             processedRequests.sort((a, b) => {
                const dateA = parsePreferredTime(a.preferredTime);
                const dateB = parsePreferredTime(b.preferredTime);

                if (dateA && dateB) return dateA.getTime() - dateB.getTime();
                if (dateA) return -1; // dateA is valid, comes first
                if (dateB) return 1;  // dateB is valid, comes first
                return 0; // both are invalid/null
            });
            break;
        case 'newest':
        default:
            // The default list from Firebase is already sorted by newest
            // No extra sorting needed unless it was changed
             processedRequests.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            break;
    }
    
    return processedRequests;
  }, [requests, searchQuery, sortBy]);

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

      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <i className="fas fa-search text-gray-400"></i>
                </span>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo từ khóa, địa điểm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                    aria-label="Tìm kiếm yêu cầu"
                />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg py-2.5 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition bg-white text-neutral-dark"
                     aria-label="Sắp xếp yêu cầu"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="participants">Nhiều học viên nhất</option>
                    <option value="soonest">Sắp diễn ra</option>
                </select>
            </div>
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
        requests={filteredAndSortedRequests}
        user={user} 
        loading={loading}
        onLoginRequired={onLoginRequired}
        partnerStatus={partnerStatus}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default RequestsPage;
import React, { useState, useEffect } from 'react';
import { auth, type User } from '../services/firebaseConfig';
import { useAdminData } from '../hooks/useAdminData';
import { useAdminActions } from '../hooks/useAdminActions';
import DashboardTab from '../components/admin/DashboardTab';
import SeoTab from '../components/admin/SeoTab';
import BlogManagement from '../components/BlogManagement';

type AdminTab = 'dashboard' | 'blog' | 'seo';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { partners, requests, loading, loadError } = useAdminData();
  const {
    actionError,
    setActionError,
    handleUpdatePartnerStatus,
    handleDeletePartner,
    handleDeleteRequest,
    handleUpdatePartner,
  } = useAdminActions();

  useEffect(() => {
    setCurrentUser(auth.currentUser);
  }, []);

  if (loading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
  if (loadError) return <div className="text-center p-10 text-red-500">{loadError}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-2">
          <i className="fas fa-tachometer-alt mr-3"></i>Bảng điều khiển Quản trị
        </h1>
        <p className="text-gray-600">Tổng quan tình hình hoạt động của hệ thống.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'dashboard'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <i className="fas fa-tachometer-alt mr-2"></i>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'blog'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <i className="fas fa-newspaper mr-2"></i>
            Quản lý Blog
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'seo'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            <i className="fas fa-search mr-2"></i>
            SEO Tools
          </button>
        </nav>
      </div>

      {actionError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-8 relative"
          role="alert"
        >
          <strong className="font-bold">Đã xảy ra lỗi!</strong>
          <p className="block sm:inline mt-1 whitespace-pre-wrap">{actionError}</p>
          <button
            onClick={() => setActionError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Đóng"
          >
            <span className="text-2xl font-bold">&times;</span>
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          partners={partners}
          requests={requests}
          onUpdatePartnerStatus={handleUpdatePartnerStatus}
          onDeletePartner={handleDeletePartner}
          onDeleteRequest={handleDeleteRequest}
          onUpdatePartner={handleUpdatePartner}
        />
      )}

      {/* Blog Management Tab */}
      {activeTab === 'blog' && currentUser && <BlogManagement user={currentUser} />}

      {/* SEO Tools Tab */}
      {activeTab === 'seo' && <SeoTab />}
    </div>
  );
};

export default AdminPage;

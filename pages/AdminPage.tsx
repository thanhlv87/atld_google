import React, { useState, useEffect, useMemo } from 'react';
import { db, firebase } from '../services/firebaseConfig';
import { PartnerProfile, TrainingRequest } from '../types';
import PartnerTable from '../components/PartnerTable';
import TrainingRequestCard from '../components/TrainingRequestCard';
import PendingPartnerCard from '../components/PendingPartnerCard';
import PartnerDetailModal from '../components/PartnerDetailModal';
import ViewersModal from '../components/ViewersModal';
import KPIStatCard from '../components/KPIStatCard';
import GrowthChart from '../components/GrowthChart';
import InfoPanel from '../components/InfoPanel';


const AdminPage: React.FC = () => {
    const [partners, setPartners] = useState<PartnerProfile[]>([]);
    const [requests, setRequests] = useState<TrainingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState<string | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<PartnerProfile | null>(null);
    const [viewingPartners, setViewingPartners] = useState<PartnerProfile[] | null>(null);

    useEffect(() => {
        setLoadError('');
        setLoading(true);

        const partnersUnsubscribe = db.collection('partners')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                (querySnapshot) => {
                    const partnersData = querySnapshot.docs.map(doc => ({ 
                        uid: doc.id, 
                        ...doc.data(),
                        // Ensure createdAt is a Firestore Timestamp
                        createdAt: doc.data().createdAt || firebase.firestore.Timestamp.now()
                    } as PartnerProfile));
                    setPartners(partnersData);
                    setLoading(false);
                },
                (err) => {
                    console.error("Error fetching partners: ", err);
                    setLoadError(prev => `${prev}\nKhông thể tải danh sách đối tác: ${err.message}`);
                    setLoading(false);
                }
            );

        const requestsUnsubscribe = db.collection('trainingRequests')
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                (querySnapshot) => {
                    const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainingRequest));
                    setRequests(requestsData);
                },
                (err) => {
                    console.error("Error fetching requests: ", err);
                    setLoadError(prev => `${prev}\nKhông thể tải danh sách yêu cầu: ${err.message}`);
                }
            );
        
        return () => {
            partnersUnsubscribe();
            requestsUnsubscribe();
        };
    }, []);
    
    // Memoized calculations for the dashboard
    const dashboardData = useMemo(() => {
        const pendingPartners = partners.filter(p => p.status === 'pending');
        const approvedPartners = partners.filter(p => p.status === 'approved');
        const urgentRequests = requests.filter(r => r.urgent);
        
        // Calculate Hot Training Types
        const trainingTypeCounts: { [key: string]: number } = requests.reduce((acc, req) => {
            req.trainingDetails?.forEach(detail => {
                acc[detail.type] = (acc[detail.type] || 0) + 1;
            });
            return acc;
        }, {} as { [key: string]: number });

        const sortedTypes = Object.entries(trainingTypeCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);
        
        const totalRequests = requests.length;
        const hotTrainingTypes = sortedTypes.map(([type, count]) => ({
            text: `${type}: ${count} yêu cầu`,
            details: `${totalRequests > 0 ? ((count / totalRequests) * 100).toFixed(0) : 0}%`
        }));

        // Calculate "Needs Attention" items
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const oldPendingPartnersCount = pendingPartners.filter(p => {
             // Ensure createdAt is not null and is a Firestore Timestamp
            return p.createdAt && 'toDate' in p.createdAt && p.createdAt.toDate() < threeDaysAgo;
        }).length;
        
        const unviewedRequestsCount = requests.filter(r => !r.viewedBy || r.viewedBy.length === 0).length;

        const attentionItems = [];
        if (oldPendingPartnersCount > 0) {
            attentionItems.push({ text: `${oldPendingPartnersCount} đối tác chờ duyệt > 3 ngày` });
        }
        if (unviewedRequestsCount > 0) {
            attentionItems.push({ text: `${unviewedRequestsCount} yêu cầu chưa có ai xem` });
        }


        return {
            totalRequests: requests.length,
            approvedPartnersCount: approvedPartners.length,
            urgentRequestsCount: urgentRequests.length,
            pendingPartnersCount: pendingPartners.length,
            hotTrainingTypes,
            attentionItems
        };
    }, [partners, requests]);


    const handleUpdatePartnerStatus = (uid: string, newStatus: 'approved' | 'rejected') => {
        setActionError(null);
        db.collection('partners').doc(uid).update({ status: newStatus })
            .catch((err: any) => {
                console.error('PERMISSION ERROR updating partner status:', err);
                const errorMessage = `LỖI PHÂN QUYỀN: Không thể cập nhật đối tác. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "update" collection "partners". Lỗi gốc: ${err.message}`;
                setActionError(errorMessage);
            });
    };

    const handleDeletePartner = (uid: string) => {
        setActionError(null);
        db.collection('partners').doc(uid).delete()
            .catch((err: any) => {
                console.error('PERMISSION ERROR deleting partner:', err);
                const errorMessage = `LỖI PHÂN QUYỀN: Không thể xóa đối tác. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "delete" collection "partners". Lỗi gốc: ${err.message}`;
                setActionError(errorMessage);
            });
    };
    
    const handleDeleteRequest = (id: string) => {
        setActionError(null);
        db.collection('trainingRequests').doc(id).delete()
            .catch((err: any) => {
                console.error('PERMISSION ERROR deleting request:', err);
                const errorMessage = `LỖI PHÂN QUYỀN: Không thể xóa yêu cầu. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "delete" collection "trainingRequests". Lỗi gốc: ${err.message}`;
                setActionError(errorMessage);
            });
    };

    const handleApproveFromModal = (uid: string) => {
        handleUpdatePartnerStatus(uid, 'approved');
        setSelectedPartner(null);
    };

    const handleRejectFromModal = (uid: string) => {
        handleUpdatePartnerStatus(uid, 'rejected');
        setSelectedPartner(null);
    };

    const handleShowViewers = (request: TrainingRequest) => {
        if (!request.viewedBy || request.viewedBy.length === 0) return;
        const viewers = partners.filter(p => request.viewedBy.includes(p.uid));
        setViewingPartners(viewers);
    };

    if (loading) return <div className="text-center p-10">Đang tải dữ liệu...</div>;
    if (loadError) return <div className="text-center p-10 text-red-500">{loadError}</div>;

    const pendingPartners = partners.filter(p => p.status === 'pending');
    const managedPartners = partners.filter(p => p.status === 'approved' || p.status === 'rejected');

    return (
        <>
            <div className="container mx-auto p-4 md:p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-2">
                        <i className="fas fa-tachometer-alt mr-3"></i>Bảng điều khiển Quản trị
                    </h1>
                    <p className="text-gray-600">Tổng quan tình hình hoạt động của hệ thống.</p>
                </div>

                {actionError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-8 relative" role="alert">
                        <strong className="font-bold">Đã xảy ra lỗi!</strong>
                        <p className="block sm:inline mt-1 whitespace-pre-wrap">{actionError}</p>
                        <button onClick={() => setActionError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Đóng">
                            <span className="text-2xl font-bold">&times;</span>
                        </button>
                    </div>
                )}

                {/* --- Start of Dashboard --- */}
                <section className="mb-12">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KPIStatCard icon="fa-file-alt" title="Tổng số yêu cầu" value={dashboardData.totalRequests.toString()} details="Tất cả thời gian" />
                        <KPIStatCard icon="fa-handshake" title="Đối tác đã duyệt" value={dashboardData.approvedPartnersCount.toString()} details="Đang hoạt động" />
                        <KPIStatCard icon="fa-exclamation-circle" title="Yêu cầu khẩn cấp" value={dashboardData.urgentRequestsCount.toString()} details="Cần ưu tiên" />
                        <KPIStatCard icon="fa-user-clock" title="Đối tác chờ duyệt" value={dashboardData.pendingPartnersCount.toString()} details="Cần hành động" />
                    </div>
                    {/* Chart and Info Panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       <div className="lg:col-span-1"><GrowthChart title="Tăng trưởng (6 tháng qua)" /></div>
                       <div className="lg:col-span-1"><InfoPanel icon="fa-fire" title="Loại hình đào tạo 'Hot'" items={dashboardData.hotTrainingTypes} /></div>
                       <div className="lg:col-span-1"><InfoPanel icon="fa-bell" title="Cần chú ý" items={dashboardData.attentionItems} theme="danger" /></div>
                    </div>
                </section>
                {/* --- End of Dashboard --- */}
                
                <div className="space-y-12">
                     <section>
                        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Đối tác chờ phê duyệt ({pendingPartners.length})</h2>
                        {pendingPartners.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                             {pendingPartners.map(partner => (
                                <PendingPartnerCard 
                                    key={partner.uid}
                                    partner={partner}
                                    onApprove={() => handleUpdatePartnerStatus(partner.uid, 'approved')}
                                    onReject={() => handleUpdatePartnerStatus(partner.uid, 'rejected')}
                                    onViewDetails={setSelectedPartner}
                                />
                             ))}
                           </div>
                        ) : (
                             <div className="text-center py-10 bg-white rounded-lg shadow-md border">
                                <p className="text-neutral-dark">Không có đối tác nào đang chờ phê duyệt.</p>
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">Danh sách Đối tác ({managedPartners.length})</h2>
                        <PartnerTable 
                            partners={managedPartners} 
                            onDelete={handleDeletePartner} 
                            viewType="managed"
                            onViewDetails={setSelectedPartner}
                        />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold text-primary mb-4">Quản lý Yêu cầu ({requests.length})</h2>
                         {requests.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {requests.map(request => (
                                    <TrainingRequestCard
                                        key={request.id}
                                        request={request}
                                        isAdminView={true}
                                        onDeleteRequest={handleDeleteRequest}
                                        onShowViewers={handleShowViewers}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow-md border">
                                <p className="text-neutral-dark">Không có yêu cầu nào.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            {selectedPartner && (
                <PartnerDetailModal 
                    partner={selectedPartner}
                    onClose={() => setSelectedPartner(null)}
                    onApprove={handleApproveFromModal}
                    onReject={handleRejectFromModal}
                />
            )}
            {viewingPartners && (
                <ViewersModal 
                    partners={viewingPartners}
                    onClose={() => setViewingPartners(null)}
                />
            )}
        </>
    );
};

export default AdminPage;
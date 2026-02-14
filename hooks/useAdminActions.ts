import { useState } from 'react';
import {
    db,
    sendEmail,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
} from '../services/firebaseConfig';
import { PartnerProfile } from '../types';

export const useAdminActions = () => {
    const [actionError, setActionError] = useState<string | null>(null);

    const handleUpdatePartnerStatus = (uid: string, newStatus: 'approved' | 'rejected') => {
        setActionError(null);
        // Lấy thông tin đối tác để gửi email
        const partnerDocRef = doc(db, 'partners', uid);
        getDoc(partnerDocRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const partner = docSnap.data() as PartnerProfile;
                    updateDoc(partnerDocRef, { status: newStatus })
                        .then(() => {
                            // Gửi email thông báo cho đối tác về thay đổi trạng thái
                            const subject =
                                newStatus === 'approved'
                                    ? 'Tài khoản của bạn đã được phê duyệt'
                                    : 'Thông báo về trạng thái tài khoản';

                            const htmlContent =
                                newStatus === 'approved'
                                    ? `
                        <h2>Chúc mừng! Tài khoản của bạn đã được phê duyệt</h2>
                        <p>Kính gửi ${partner.email},</p>
                        <p>Chúng tôi vui mừng thông báo rằng tài khoản của bạn đã được phê duyệt. Bây giờ bạn có thể truy cập hệ thống và bắt đầu nhận các yêu cầu đào tạo.</p>
                        <p>Vui lòng đăng nhập vào hệ thống để xem các yêu cầu đào tạo phù hợp với năng lực của bạn.</p>
                        <p>Trân trọng,<br/>Đội ngũ quản trị hệ thống</p>
                        `
                                    : `
                        <h2>Thông báo về trạng thái tài khoản</h2>
                        <p>Kính gửi ${partner.email},</p>
                        <p>Chúng tôi xin thông báo rằng tài khoản của bạn đã được cập nhật trạng thái thành từ chối. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với quản trị viên.</p>
                        <p>Trân trọng,<br/>Đội ngũ quản trị hệ thống</p>
                        `;

                            sendEmail(partner.email, subject, htmlContent).catch((emailErr) => {
                                console.error('Error sending notification email:', emailErr);
                            });
                        })
                        .catch((err: any) => {
                            console.error('PERMISSION ERROR updating partner status:', err);
                            const errorMessage = `LỖI PHÂN QUYỀN: Không thể cập nhật đối tác. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "update" collection "partners". Lỗi gốc: ${err.message}`;
                            setActionError(errorMessage);
                        });
                }
            })
            .catch((err) => {
                console.error('Error fetching partner data:', err);
                // Nếu không lấy được thông tin đối tác, vẫn cập nhật trạng thái
                const partnerDocRef = doc(db, 'partners', uid);
                updateDoc(partnerDocRef, { status: newStatus }).catch((err: any) => {
                    console.error('PERMISSION ERROR updating partner status:', err);
                    const errorMessage = `LỖI PHÂN QUYỀN: Không thể cập nhật đối tác. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "update" collection "partners". Lỗi gốc: ${err.message}`;
                    setActionError(errorMessage);
                });
            });
    };

    const handleDeletePartner = (uid: string) => {
        setActionError(null);
        const partnerDocRef = doc(db, 'partners', uid);
        deleteDoc(partnerDocRef).catch((err: any) => {
            console.error('PERMISSION ERROR deleting partner:', err);
            const errorMessage = `LỖI PHÂN QUYỀN: Không thể xóa đối tác. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "delete" collection "partners". Lỗi gốc: ${err.message}`;
            setActionError(errorMessage);
        });
    };

    const handleDeleteRequest = (id: string) => {
        setActionError(null);
        const requestDocRef = doc(db, 'trainingRequests', id);
        deleteDoc(requestDocRef).catch((err: any) => {
            console.error('PERMISSION ERROR deleting request:', err);
            const errorMessage = `LỖI PHÂN QUYỀN: Không thể xóa yêu cầu. Vui lòng kiểm tra lại Security Rules trên Firebase để đảm bảo tài khoản Admin có quyền "delete" collection "trainingRequests". Lỗi gốc: ${err.message}`;
            setActionError(errorMessage);
        });
    };

    const handleUpdatePartner = (uid: string, updates: Partial<PartnerProfile>) => {
        setActionError(null);
        const partnerDocRef = doc(db, 'partners', uid);
        updateDoc(partnerDocRef, updates)
            .then(() => {
                console.log('Partner updated successfully:', updates);
            })
            .catch((err: any) => {
                console.error('Error updating partner:', err);
                const errorMessage = `Không thể cập nhật đối tác. Lỗi: ${err.message}`;
                setActionError(errorMessage);
            });
    };

    return {
        actionError,
        setActionError,
        handleUpdatePartnerStatus,
        handleDeletePartner,
        handleDeleteRequest,
        handleUpdatePartner,
    };
};

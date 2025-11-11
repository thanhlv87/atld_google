import React from 'react';
import { PartnerProfile } from '../types';

interface PartnerDetailModalProps {
    partner: PartnerProfile;
    onClose: () => void;
    onApprove: (uid: string) => void;
    onReject: (uid: string) => void;
}

const DetailItem: React.FC<{ label: string, value?: string | string[] }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        {Array.isArray(value) && value.length > 0 ? (
             <ul className="list-disc list-inside mt-1 space-y-1">
                {value.map((item, index) => <li key={index} className="text-neutral-dark">{item}</li>)}
            </ul>
        ) : (
            <p className="text-neutral-dark">{value || 'Chưa cung cấp'}</p>
        )}
    </div>
);


const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({ partner, onClose, onApprove, onReject }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                     <h2 className="text-2xl font-bold text-primary">
                        Chi tiết Đối tác
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>
               
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Email</p>
                        <a href={`mailto:${partner.email}`} className="text-accent hover:underline">{partner.email}</a>
                    </div>
                    <DetailItem label="Mã số thuế" value={partner.taxId} />
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Số điện thoại</p>
                        <a href={`tel:${partner.phone}`} className="text-accent hover:underline">{partner.phone}</a>
                    </div>
                    <DetailItem label="Địa chỉ" value={partner.address} />
                    <DetailItem label="Khách hàng/Dự án tiêu biểu" value={partner.notableClients} />
                    <DetailItem label="Năng lực đào tạo" value={partner.capabilities} />
                    <DetailItem label="Nhận email thông báo" value={partner.subscribesToEmails ? 'Có' : 'Không'} />
                </div>

                <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                     <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => onReject(partner.uid)}
                        className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                    >
                        Từ chối
                    </button>
                     <button
                        onClick={() => onApprove(partner.uid)}
                        className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition"
                    >
                        Phê duyệt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerDetailModal;

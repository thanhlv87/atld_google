import React from 'react';
import { PartnerProfile } from '../types';

interface PendingPartnerCardProps {
    partner: PartnerProfile;
    onApprove: (uid: string) => void;
    onReject: (uid: string) => void;
    onViewDetails: (partner: PartnerProfile) => void;
}

const PendingPartnerCard: React.FC<PendingPartnerCardProps> = ({ partner, onApprove, onReject, onViewDetails }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 transition-shadow hover:shadow-xl flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-neutral-dark truncate" title={partner.email}>{partner.email}</h3>
                <p className="text-sm text-gray-500 mt-1">MST: {partner.taxId}</p>
                 <div className="border-t my-3"></div>
                <div className="text-sm text-gray-700 space-y-1">
                    <p><strong><i className="fas fa-phone w-4 text-center mr-1"></i> SĐT:</strong> {partner.phone}</p>
                    <p><strong><i className="fas fa-map-marker-alt w-4 text-center mr-1"></i> Địa chỉ:</strong> {partner.address}</p>
                </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                    onClick={() => onViewDetails(partner)}
                    className="flex-1 text-center bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 text-sm"
                >
                    Xem chi tiết
                </button>
                <div className="flex flex-1 gap-2">
                     <button
                        onClick={() => onApprove(partner.uid)}
                        className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 text-sm"
                    >
                        Duyệt
                    </button>
                    <button
                        onClick={() => onReject(partner.uid)}
                        className="flex-1 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300 text-sm"
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingPartnerCard;
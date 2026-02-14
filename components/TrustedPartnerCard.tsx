import React from 'react';
import { TrustedPartner } from '../types';

interface TrustedPartnerCardProps {
  partner: TrustedPartner;
  onClick: () => void;
}

const TrustedPartnerCard: React.FC<TrustedPartnerCardProps> = ({ partner, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group hover:-translate-y-2"
    >
      {/* Verified Badge */}
      {partner.verified && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <i className="fas fa-check-circle"></i>
            <span>Đã xác nhận</span>
          </div>
        </div>
      )}

      {/* Logo/Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.businessName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-center p-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mb-2 group-hover:rotate-6 transition-transform duration-300">
              <i className="fas fa-building text-4xl text-white"></i>
            </div>
          </div>
        )}
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-neutral-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {partner.businessName}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{partner.description}</p>

        {/* Specializations */}
        {partner.specializations && partner.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {partner.specializations.slice(0, 2).map((spec, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
            {partner.specializations.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                +{partner.specializations.length - 2} thêm
              </span>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <i className="fas fa-id-card w-4 text-gray-400"></i>
            <span className="font-mono text-xs">{partner.taxId}</span>
          </div>
          {partner.website && (
            <div className="flex items-center gap-2">
              <i className="fas fa-globe w-4 text-gray-400"></i>
              <span className="text-xs truncate text-blue-600">{partner.website}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {partner.establishedYear && `Từ ${partner.establishedYear}`}
          </span>
          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all">
            <span>Xem chi tiết</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedPartnerCard;

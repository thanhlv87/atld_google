import React from 'react';
import { TrustedPartner } from '../types';

interface TrustedPartnerInfoModalProps {
  partner: TrustedPartner;
  onClose: () => void;
  onViewAllPartners: () => void;
}

const TrustedPartnerInfoModal: React.FC<TrustedPartnerInfoModalProps> = ({
  partner,
  onClose,
  onViewAllPartners
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{partner.businessName}</h2>
                {partner.verified && (
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                    <i className="fas fa-check-circle text-sm"></i>
                    <span className="text-xs font-semibold">Đã xác nhận</span>
                  </div>
                )}
              </div>
              <p className="text-white/90 text-sm">{partner.description}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Đóng"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Logo (if available) */}
          {partner.logo && (
            <div className="flex justify-center">
              <img
                src={partner.logo}
                alt={partner.businessName}
                className="max-h-32 rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-lg text-neutral-dark mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle text-primary"></i>
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-id-card w-5 text-gray-400 mt-1"></i>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mã số thuế</p>
                  <p className="font-mono font-semibold text-neutral-dark">{partner.taxId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-globe w-5 text-gray-400 mt-1"></i>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Website</p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium break-all"
                  >
                    {partner.website}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt w-5 text-gray-400 mt-1"></i>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                  <p className="text-neutral-dark">{partner.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-phone w-5 text-gray-400 mt-1"></i>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  <a href={`tel:${partner.phone}`} className="text-neutral-dark hover:text-primary font-medium">
                    {partner.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-envelope w-5 text-gray-400 mt-1"></i>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${partner.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                    {partner.email}
                  </a>
                </div>
              </div>

              {partner.establishedYear && (
                <div className="flex items-start gap-3">
                  <i className="fas fa-calendar-alt w-5 text-gray-400 mt-1"></i>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Năm thành lập</p>
                    <p className="text-neutral-dark font-semibold">{partner.establishedYear}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Specializations */}
          {partner.specializations && partner.specializations.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="font-bold text-lg text-neutral-dark mb-3 flex items-center gap-2">
                <i className="fas fa-certificate text-blue-600"></i>
                Lĩnh vực chuyên môn
              </h3>
              <div className="flex flex-wrap gap-2">
                {partner.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onViewAllPartners}
              className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <i className="fas fa-list"></i>
              <span>Xem tất cả đối tác</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              <span>Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedPartnerInfoModal;

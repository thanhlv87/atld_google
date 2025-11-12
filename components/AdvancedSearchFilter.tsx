import React, { useState } from 'react';
import { TRAINING_TYPES } from '../types';

export interface FilterState {
  trainingTypes: string[];
  provinces: string[];
  participantsMin: number;
  participantsMax: number;
  urgent: boolean;
  dateFrom: string;
  dateTo: string;
}

interface AdvancedSearchFilterProps {
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

// Danh sách tỉnh thành phổ biến tại Việt Nam
const VIETNAM_PROVINCES = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái"
];

const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({ onFilterChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    trainingTypes: [],
    provinces: [],
    participantsMin: 0,
    participantsMax: 1000,
    urgent: false,
    dateFrom: '',
    dateTo: ''
  });

  const handleTrainingTypeToggle = (type: string) => {
    const newTypes = filters.trainingTypes.includes(type)
      ? filters.trainingTypes.filter(t => t !== type)
      : [...filters.trainingTypes, type];

    const newFilters = { ...filters, trainingTypes: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const newFilters = { ...filters, provinces: selectedOptions };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleParticipantsChange = (field: 'participantsMin' | 'participantsMax', value: number) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleUrgentToggle = () => {
    const newFilters = { ...filters, urgent: !filters.urgent };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      trainingTypes: [],
      provinces: [],
      participantsMin: 0,
      participantsMax: 1000,
      urgent: false,
      dateFrom: '',
      dateTo: ''
    };
    setFilters(clearedFilters);
    onClear();
  };

  const activeFilterCount =
    filters.trainingTypes.length +
    filters.provinces.length +
    (filters.urgent ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.participantsMin > 0 ? 1 : 0) +
    (filters.participantsMax < 1000 ? 1 : 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <i className="fas fa-filter text-primary"></i>
          <span className="font-semibold text-neutral-dark">Bộ lọc nâng cao</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-500`}></i>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Training Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại đào tạo
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                {TRAINING_TYPES.map((type) => (
                  <label key={type} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={filters.trainingTypes.includes(type)}
                      onChange={() => handleTrainingTypeToggle(type)}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Provinces */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố
              </label>
              <select
                multiple
                value={filters.provinces}
                onChange={handleProvinceChange}
                className="w-full border border-gray-300 rounded-md p-2 h-60 focus:ring-2 focus:ring-primary focus:border-primary"
                aria-label="Chọn tỉnh thành"
              >
                {VIETNAM_PROVINCES.map((province) => (
                  <option key={province} value={province} className="py-1">
                    {province}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Giữ Ctrl/Cmd để chọn nhiều
              </p>
            </div>

            {/* Additional Filters */}
            <div className="space-y-4">
              {/* Participants Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số học viên
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.participantsMin}
                    onChange={(e) => handleParticipantsChange('participantsMin', parseInt(e.target.value) || 0)}
                    placeholder="Từ"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={filters.participantsMax}
                    onChange={(e) => handleParticipantsChange('participantsMax', parseInt(e.target.value) || 1000)}
                    placeholder="Đến"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian dự kiến
                </label>
                <div className="space-y-2">
                  <input
                    type="month"
                    value={filters.dateFrom}
                    onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Từ tháng"
                  />
                  <input
                    type="month"
                    value={filters.dateTo}
                    onChange={(e) => handleDateChange('dateTo', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Đến tháng"
                  />
                </div>
              </div>

              {/* Urgent Checkbox */}
              <div>
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.urgent}
                    onChange={handleUrgentToggle}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <div className="flex items-center gap-2">
                    <i className="fas fa-bolt text-red-500"></i>
                    <span className="text-sm font-medium text-gray-700">Chỉ yêu cầu khẩn cấp</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              <i className="fas fa-times mr-2"></i>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilter;

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
    const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
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
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-md mb-8 overflow-hidden">
      {/* Header with Gradient */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-primary/5 to-orange-500/5 hover:from-primary/10 hover:to-orange-500/10 transition-all duration-300"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-orange-600 p-2.5 rounded-lg shadow-md">
            <i className="fas fa-sliders-h text-white text-sm"></i>
          </div>
          <span className="font-bold text-neutral-dark text-lg">Bộ lọc nâng cao</span>
          {activeFilterCount > 0 && (
            <span className="bg-gradient-to-r from-primary to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse">
              {activeFilterCount} đang áp dụng
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-xs text-gray-600 hover:text-red-500 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <i className="fas fa-times-circle mr-1"></i>
              Xóa hết
            </button>
          )}
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
        </div>
      </button>

      {/* Filter Content with Animation */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Training Types Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <i className="fas fa-graduation-cap text-blue-600"></i>
                </div>
                <label className="text-sm font-bold text-gray-800">
                  Loại đào tạo
                </label>
              </div>

              {/* Selected Training Types Pills */}
              {filters.trainingTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100">
                  {filters.trainingTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm"
                    >
                      {type}
                      <button
                        onClick={() => handleTrainingTypeToggle(type)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-1 max-h-52 overflow-y-auto custom-scrollbar">
                {TRAINING_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex items-center cursor-pointer hover:bg-blue-50 p-2.5 rounded-lg transition-all ${
                      filters.trainingTypes.includes(type) ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.trainingTypes.includes(type)}
                      onChange={() => handleTrainingTypeToggle(type)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Provinces Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <i className="fas fa-map-marker-alt text-green-600"></i>
                </div>
                <label className="text-sm font-bold text-gray-800">
                  Tỉnh/Thành phố
                </label>
              </div>

              {/* Selected Provinces Pills */}
              {filters.provinces.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100">
                  {filters.provinces.map((province) => (
                    <span
                      key={province}
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm"
                    >
                      {province}
                      <button
                        onClick={() => {
                          const newProvinces = filters.provinces.filter(p => p !== province);
                          const newFilters = { ...filters, provinces: newProvinces };
                          setFilters(newFilters);
                          onFilterChange(newFilters);
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <select
                multiple
                value={filters.provinces}
                onChange={handleProvinceChange}
                className="w-full border border-gray-300 rounded-lg p-2 h-52 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 hover:bg-white transition custom-scrollbar"
                aria-label="Chọn tỉnh thành"
              >
                {VIETNAM_PROVINCES.map((province) => (
                  <option
                    key={province}
                    value={province}
                    className="py-2 px-2 hover:bg-green-50 cursor-pointer"
                  >
                    {province}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <i className="fas fa-info-circle text-blue-400"></i>
                Giữ Ctrl/Cmd để chọn nhiều
              </p>
            </div>

            {/* Additional Filters Card */}
            <div className="space-y-4">
              {/* Participants Range */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <i className="fas fa-users text-purple-600"></i>
                  </div>
                  <label className="text-sm font-bold text-gray-800">
                    Số học viên
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={filters.participantsMin}
                      onChange={(e) => handleParticipantsChange('participantsMin', parseInt(e.target.value) || 0)}
                      placeholder="Từ"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pl-8"
                    />
                    <i className="fas fa-arrow-right absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  </div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={filters.participantsMax}
                      onChange={(e) => handleParticipantsChange('participantsMax', parseInt(e.target.value) || 1000)}
                      placeholder="Đến"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pl-8"
                    />
                    <i className="fas fa-arrow-left absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  </div>
                </div>
                {(filters.participantsMin > 0 || filters.participantsMax < 1000) && (
                  <p className="text-xs text-purple-600 font-medium mt-2 flex items-center gap-1">
                    <i className="fas fa-check-circle"></i>
                    {filters.participantsMin} - {filters.participantsMax} người
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <i className="fas fa-calendar-alt text-orange-600"></i>
                  </div>
                  <label className="text-sm font-bold text-gray-800">
                    Thời gian dự kiến
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <i className="fas fa-calendar-check absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                    <input
                      type="month"
                      value={filters.dateFrom}
                      onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Từ tháng"
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-calendar-times absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                    <input
                      type="month"
                      value={filters.dateTo}
                      onChange={(e) => handleDateChange('dateTo', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Đến tháng"
                    />
                  </div>
                </div>
              </div>

              {/* Urgent Checkbox */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <label className={`flex items-center cursor-pointer p-3 rounded-lg transition-all ${
                  filters.urgent ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300' : 'hover:bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={filters.urgent}
                    onChange={handleUrgentToggle}
                    className="w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 rounded border-gray-300"
                  />
                  <div className="flex items-center gap-2 ml-3">
                    <div className={`p-1.5 rounded-lg ${filters.urgent ? 'bg-red-100' : 'bg-gray-100'}`}>
                      <i className={`fas fa-bolt ${filters.urgent ? 'text-red-600' : 'text-gray-400'}`}></i>
                    </div>
                    <span className={`text-sm font-bold ${filters.urgent ? 'text-red-700' : 'text-gray-700'}`}>
                      Chỉ yêu cầu khẩn cấp
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fas fa-filter text-primary"></i>
                  <span className="text-sm font-bold text-gray-700">
                    {activeFilterCount} bộ lọc đang áp dụng
                  </span>
                </div>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-bold text-sm shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-times-circle mr-2"></i>
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ea580c);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #c2410c);
        }
      `}</style>
    </div>
  );
};

export default AdvancedSearchFilter;

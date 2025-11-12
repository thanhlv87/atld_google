import React, { useEffect } from 'react';
import { Page } from '../App';

interface TrainingLandingPageProps {
  trainingType: string;
  onNavigate: (page: Page) => void;
  onCreateRequestClick: () => void;
}

// Dữ liệu chi tiết cho từng loại đào tạo
const trainingData: Record<string, {
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  benefits: string[];
  targetAudience: string[];
  content: string[];
  requirements: string[];
  duration: string;
  certificate: string;
  imageUrl: string;
  bgColor: string;
  iconClass: string;
}> = {
  'an-toan-dien': {
    title: 'Đào Tạo An Toàn Điện',
    description: 'Khóa đào tạo an toàn điện chuyên nghiệp, đầy đủ kiến thức và kỹ năng vận hành, sửa chữa điện an toàn theo quy định Nhà nước',
    metaDescription: 'Đào tạo an toàn điện chuyên nghiệp, cấp chứng chỉ theo Nghị định 44. Học viên được trang bị kiến thức về điện an toàn, vận hành thiết bị điện, xử lý sự cố.',
    keywords: ['đào tạo an toàn điện', 'chứng chỉ an toàn điện', 'huấn luyện điện công nghiệp', 'an toàn lao động điện', 'nghị định 44'],
    benefits: [
      'Hiểu rõ các nguy cơ điện và cách phòng tránh',
      'Thực hành vận hành thiết bị điện an toàn',
      'Xử lý sự cố điện hiệu quả',
      'Đạt chứng chỉ theo quy định Nhà nước',
      'Giảm thiểu tai nạn lao động do điện',
      'Nâng cao năng lực nghề nghiệp'
    ],
    targetAudience: [
      'Công nhân điện, thợ điện',
      'Kỹ sư vận hành hệ thống điện',
      'Cán bộ quản lý an toàn điện',
      'Người làm việc gần thiết bị điện',
      'Doanh nghiệp có hoạt động liên quan điện'
    ],
    content: [
      'Kiến thức cơ bản về điện và an toàn điện',
      'Các quy định pháp luật về an toàn điện',
      'Thiết bị bảo vệ điện và cách sử dụng',
      'Vận hành an toàn thiết bị điện',
      'Sơ cứu người bị điện giật',
      'Xử lý sự cố điện phổ biến',
      'Kiểm tra và bảo trì hệ thống điện',
      'Thực hành an toàn điện trong thực tế'
    ],
    requirements: [
      'Trên 18 tuổi',
      'Sức khỏe tốt, không mắc bệnh nghề nghiệp',
      'Có kiến thức cơ bản về điện (ưu tiên)',
      'Mang theo CMND/CCCD'
    ],
    duration: '3-5 ngày (20-40 giờ)',
    certificate: 'Chứng chỉ An Toàn Điện theo Nghị định 44/2016/NĐ-CP',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop',
    bgColor: 'from-yellow-500 to-orange-600',
    iconClass: 'fa-bolt'
  },
  'an-toan-xay-dung': {
    title: 'Đào Tạo An Toàn Xây Dựng',
    description: 'Khóa đào tạo an toàn xây dựng toàn diện, trang bị kiến thức và kỹ năng làm việc an toàn tại công trường xây dựng',
    metaDescription: 'Đào tạo an toàn xây dựng cho công nhân, kỹ sư xây dựng. Cấp chứng chỉ hợp lệ, đúng quy định. Học thực tế tại công trường.',
    keywords: ['đào tạo an toàn xây dựng', 'huấn luyện công trường', 'chứng chỉ xây dựng', 'an toàn lao động xây dựng', 'nghị định 44'],
    benefits: [
      'Nhận biết nguy hiểm tại công trường',
      'Sử dụng thiết bị bảo hộ đúng cách',
      'Làm việc trên cao an toàn',
      'Phòng ngừa tai nạn lao động',
      'Tuân thủ quy định an toàn xây dựng',
      'Cấp chứng chỉ hợp lệ toàn quốc'
    ],
    targetAudience: [
      'Công nhân xây dựng',
      'Kỹ sư giám sát công trình',
      'Chủ đầu tư, nhà thầu',
      'Quản đốc công trường',
      'Cán bộ ATVSLĐ trong xây dựng'
    ],
    content: [
      'Quy định pháp luật về an toàn xây dựng',
      'Nhận diện nguy cơ tại công trường',
      'Thiết bị bảo hộ cá nhân (PPE)',
      'An toàn làm việc trên cao',
      'An toàn giàn giáo, thang máy công trình',
      'Phòng chống sập đổ, vùi lấp',
      'Sơ cứu tai nạn tại công trường',
      'Kế hoạch ứng phó khẩn cấp'
    ],
    requirements: [
      'Trên 18 tuổi',
      'Sức khỏe đủ tiêu chuẩn làm việc xây dựng',
      'Không có chống chỉ định sức khỏe',
      'Mang theo CMND/CCCD và ảnh 3x4'
    ],
    duration: '3-7 ngày (24-56 giờ)',
    certificate: 'Chứng chỉ An Toàn Xây Dựng theo Nghị định 44/2016/NĐ-CP',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=400&fit=crop',
    bgColor: 'from-blue-500 to-cyan-600',
    iconClass: 'fa-hard-hat'
  },
  'an-toan-hoa-chat': {
    title: 'Đào Tạo An Toàn Hóa Chất',
    description: 'Khóa đào tạo an toàn hóa chất, hướng dẫn xử lý, bảo quản và sử dụng hóa chất đúng quy định',
    metaDescription: 'Đào tạo an toàn hóa chất cho doanh nghiệp. Học về MSDS, phân loại hóa chất, xử lý sự cố hóa chất. Cấp chứng chỉ hợp lệ.',
    keywords: ['đào tạo an toàn hóa chất', 'xử lý hóa chất', 'MSDS', 'chứng chỉ hóa chất', 'an toàn lao động hóa chất'],
    benefits: [
      'Hiểu rõ tính chất và nguy hiểm của hóa chất',
      'Đọc và sử dụng phiếu MSDS',
      'Bảo quản hóa chất đúng cách',
      'Xử lý sự cố tràn đổ hóa chất',
      'Sơ cứu khi tiếp xúc hóa chất',
      'Tuân thủ quy định về hóa chất'
    ],
    targetAudience: [
      'Công nhân làm việc với hóa chất',
      'Cán bộ kho hóa chất',
      'Kỹ sư an toàn hóa chất',
      'Quản lý nhà máy hóa chất',
      'Doanh nghiệp sản xuất/sử dụng hóa chất'
    ],
    content: [
      'Phân loại và nguy hiểm của hóa chất',
      'Hệ thống GHS - Global Harmonized System',
      'Đọc và hiểu phiếu MSDS',
      'Thiết bị bảo hộ khi làm việc với hóa chất',
      'Bảo quản và lưu trữ hóa chất',
      'Xử lý sự cố tràn đổ hóa chất',
      'Sơ cứu khi tiếp xúc hóa chất',
      'Quy định pháp luật về hóa chất'
    ],
    requirements: [
      'Trên 18 tuổi',
      'Sức khỏe tốt, không dị ứng',
      'Có kiến thức cơ bản về hóa học (ưu tiên)',
      'Mang theo CMND/CCCD'
    ],
    duration: '2-4 ngày (16-32 giờ)',
    certificate: 'Chứng chỉ An Toàn Hóa Chất theo quy định',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
    bgColor: 'from-green-500 to-emerald-600',
    iconClass: 'fa-flask'
  },
  'pccc': {
    title: 'Đào Tạo Phòng Cháy Chữa Cháy (PCCC)',
    description: 'Khóa đào tạo phòng cháy chữa cháy chuyên nghiệp, trang bị kiến thức và kỹ năng xử lý tình huống cháy nổ',
    metaDescription: 'Đào tạo PCCC cho doanh nghiệp, cán bộ, công nhân. Học thực hành sử dụng bình chữa cháy, thoát hiểm, cứu nạn. Cấp chứng chỉ hợp lệ.',
    keywords: ['đào tạo pccc', 'phòng cháy chữa cháy', 'chứng chỉ pccc', 'an toàn cháy nổ', 'nghị định 136'],
    benefits: [
      'Nhận biết nguy cơ cháy nổ',
      'Sử dụng thiết bị PCCC thành thạo',
      'Xử lý tình huống cháy hiệu quả',
      'Kỹ năng thoát hiểm và cứu nạn',
      'Tuân thủ quy định PCCC',
      'Bảo vệ tính mạng và tài sản'
    ],
    targetAudience: [
      'Nhân viên trong doanh nghiệp',
      'Cán bộ phụ trách PCCC',
      'Bảo vệ, lễ tân',
      'Quản lý tòa nhà, chung cư',
      'Chủ cơ sở kinh doanh'
    ],
    content: [
      'Cơ sở khoa học về cháy và chất cháy',
      'Phân loại cháy và phương pháp chữa cháy',
      'Thiết bị PCCC và cách sử dụng',
      'Thực hành sử dụng bình chữa cháy',
      'Kế hoạch phòng cháy và chữa cháy',
      'Thoát hiểm trong cháy nổ',
      'Sơ cứu nạn nhân vụ cháy',
      'Quy định pháp luật về PCCC'
    ],
    requirements: [
      'Trên 18 tuổi',
      'Sức khỏe tốt',
      'Không có tiền sử bệnh tim, hô hấp nghiêm trọng',
      'Mang theo CMND/CCCD'
    ],
    duration: '2-3 ngày (12-24 giờ)',
    certificate: 'Chứng chỉ PCCC theo Nghị định 136/2020/NĐ-CP',
    imageUrl: 'https://images.unsplash.com/photo-1587588354456-ae376af71a25?w=800&h=400&fit=crop',
    bgColor: 'from-red-500 to-rose-600',
    iconClass: 'fa-fire-extinguisher'
  },
  'an-toan-thiet-bi-nang': {
    title: 'Đào Tạo An Toàn Vận Hành Thiết Bị Nâng',
    description: 'Khóa đào tạo vận hành thiết bị nâng an toàn (cần cẩu, xe nâng, thang máy công trình...)',
    metaDescription: 'Đào tạo lái xe nâng, vận hành cần cẩu, thang máy công trình. Cấp chứng chỉ điều khiển thiết bị nâng hợp lệ toàn quốc.',
    keywords: ['đào tạo xe nâng', 'lái xe nâng', 'vận hành cần cẩu', 'chứng chỉ điều khiển thiết bị nâng', 'an toàn thiết bị nâng'],
    benefits: [
      'Vận hành thiết bị nâng an toàn',
      'Kiểm tra và bảo dưỡng thiết bị',
      'Xử lý tình huống khẩn cấp',
      'Tăng hiệu quả công việc',
      'Giảm nguy cơ tai nạn',
      'Cấp chứng chỉ vận hành hợp lệ'
    ],
    targetAudience: [
      'Lái xe nâng, xe cẩu',
      'Công nhân vận hành thiết bị nâng',
      'Kỹ thuật viên bảo trì',
      'Quản đốc kho bãi',
      'Doanh nghiệp có thiết bị nâng'
    ],
    content: [
      'Cấu tạo thiết bị nâng',
      'Nguyên lý hoạt động',
      'Kỹ thuật vận hành an toàn',
      'Tín hiệu và quy tắc an toàn',
      'Kiểm tra trước khi vận hành',
      'Bảo dưỡng định kỳ',
      'Xử lý sự cố thường gặp',
      'Thực hành vận hành thực tế'
    ],
    requirements: [
      'Trên 18 tuổi',
      'Có giấy phép lái xe (ưu tiên)',
      'Sức khỏe đủ tiêu chuẩn',
      'Thị lực và thính lực tốt',
      'Mang theo CMND/CCCD và giấy khám sức khỏe'
    ],
    duration: '5-10 ngày (40-80 giờ)',
    certificate: 'Chứng chỉ Vận hành Thiết bị Nâng theo Thông tư 27/2018/TT-BXD',
    imageUrl: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=400&fit=crop',
    bgColor: 'from-purple-500 to-indigo-600',
    iconClass: 'fa-shipping-fast'
  },
  'an-toan-lam-viec-tren-cao': {
    title: 'Đào Tạo An Toàn Làm Việc Trên Cao',
    description: 'Khóa đào tạo an toàn làm việc trên cao, trang bị kỹ năng và kiến thức phòng ngừa tai nạn rơi ngã',
    metaDescription: 'Đào tạo làm việc trên cao an toàn. Học sử dụng dây an toàn, giàn giáo. Cấp chứng chỉ làm việc trên cao hợp lệ.',
    keywords: ['đào tạo làm việc trên cao', 'an toàn độ cao', 'chứng chỉ làm việc trên cao', 'dây an toàn', 'giàn giáo'],
    benefits: [
      'Nhận biết nguy hiểm khi làm việc trên cao',
      'Sử dụng thiết bị bảo vệ chống rơi',
      'Kỹ thuật leo trèo an toàn',
      'Cứu hộ người bị rơi treo',
      'Giảm thiểu tai nạn rơi ngã',
      'Tuân thủ quy định an toàn'
    ],
    targetAudience: [
      'Công nhân xây dựng',
      'Thợ lắp dựng giàn giáo',
      'Kỹ thuật viên bảo trì',
      'Thợ sơn, làm mái',
      'Người làm việc trên cao trên 2m'
    ],
    content: [
      'Quy định về làm việc trên cao',
      'Nguy hiểm và phòng ngừa rơi ngã',
      'Thiết bị bảo vệ chống rơi',
      'Dây an toàn và cách sử dụng',
      'Điểm neo và hệ thống neo',
      'Giàn giáo và thang leo',
      'Kỹ thuật cứu hộ trên cao',
      'Thực hành làm việc trên cao'
    ],
    requirements: [
      'Trên 18 tuổi',
      'Sức khỏe tốt, không sợ độ cao',
      'Không có bệnh tim mạch, tiền đình',
      'Thị lực tốt',
      'Mang theo CMND/CCCD và giấy khám sức khỏe'
    ],
    duration: '2-3 ngày (16-24 giờ)',
    certificate: 'Chứng chỉ Làm việc Trên cao theo Nghị định 44/2016/NĐ-CP',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop',
    bgColor: 'from-sky-500 to-blue-600',
    iconClass: 'fa-climbing'
  },
  'so-cap-cuu': {
    title: 'Đào Tạo Sơ Cấp Cứu',
    description: 'Khóa đào tạo sơ cấp cứu cơ bản, trang bị kỹ năng xử lý tình huống cấp cứu tại nơi làm việc',
    metaDescription: 'Đào tạo sơ cấp cứu cho doanh nghiệp. Học CPR, xử lý chấn thương, sơ cứu ban đầu. Cấp chứng chỉ sơ cấp cứu quốc tế.',
    keywords: ['đào tạo sơ cấp cứu', 'CPR', 'sơ cứu ban đầu', 'chứng chỉ sơ cấp cứu', 'first aid'],
    benefits: [
      'Kỹ năng sơ cứu cơ bản',
      'CPR và sử dụng AED',
      'Xử lý chảy máu, gãy xương',
      'Cấp cứu ngừng hô hấp',
      'Tự tin xử lý tình huống khẩn cấp',
      'Cứu sống trong tình huống nguy hiểm'
    ],
    targetAudience: [
      'Nhân viên y tế doanh nghiệp',
      'Cán bộ ATVSLĐ',
      'Giáo viên, nhân viên trường học',
      'Nhân viên khách sạn, nhà hàng',
      'Mọi người muốn biết sơ cấp cứu'
    ],
    content: [
      'Nguyên tắc sơ cứu ban đầu',
      'Đánh giá tình trạng nạn nhân',
      'Hồi sức tim phổi (CPR)',
      'Sử dụng máy sốc tim tự động (AED)',
      'Xử lý chảy máu và băng bó vết thương',
      'Sơ cứu gãy xương, bong gân',
      'Sơ cứu bỏng, điện giật',
      'Xử lý sốc, ngạt, ngộ độc'
    ],
    requirements: [
      'Không giới hạn độ tuổi (khuyến khích từ 16 tuổi)',
      'Sức khỏe tốt',
      'Nhiệt tình, ham học hỏi',
      'Mang theo CMND/CCCD'
    ],
    duration: '1-2 ngày (8-16 giờ)',
    certificate: 'Chứng chỉ Sơ Cấp Cứu (First Aid Certificate)',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&h=400&fit=crop',
    bgColor: 'from-pink-500 to-red-600',
    iconClass: 'fa-medkit'
  }
};

const TrainingLandingPage: React.FC<TrainingLandingPageProps> = ({
  trainingType,
  onNavigate,
  onCreateRequestClick
}) => {
  const data = trainingData[trainingType];

  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = `${data.title} - SafetyConnect`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', data.keywords.join(', '));
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }, [trainingType, data]);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-red-600">Không tìm thấy trang</h1>
        <button onClick={() => onNavigate('home')} className="mt-4 text-primary hover:underline">
          ← Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-light min-h-screen">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${data.bgColor} text-white py-16 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="mb-4 text-white hover:text-gray-200 transition-colors flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Quay về trang chủ
          </button>
          <div className="flex items-center mb-6">
            <i className={`fas ${data.iconClass} text-6xl mr-6`}></i>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{data.title}</h1>
              <p className="text-xl opacity-90">{data.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={onCreateRequestClick}
              className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Tạo Yêu Cầu Ngay
            </button>
            <button
              onClick={() => onNavigate('requests')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition-all"
            >
              <i className="fas fa-list mr-2"></i>
              Xem Đối Tác
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center">
              <i className="fas fa-star text-yellow-500 mr-3"></i>
              Lợi Ích Khóa Học
            </h2>
            <ul className="space-y-3">
              {data.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Audience */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-neutral-dark mb-4 flex items-center">
              <i className="fas fa-users text-blue-500 mr-3"></i>
              Đối Tượng Tham Gia
            </h2>
            <ul className="space-y-3">
              {data.targetAudience.map((audience, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-user-check text-primary mr-3 mt-1"></i>
                  <span>{audience}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-neutral-dark mb-6 flex items-center">
            <i className="fas fa-book-open text-accent mr-3"></i>
            Nội Dung Khóa Học
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.content.map((item, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements and Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center">
              <i className="fas fa-clipboard-check text-green-500 mr-3"></i>
              Yêu Cầu
            </h3>
            <ul className="space-y-2">
              {data.requirements.map((req, index) => (
                <li key={index} className="flex items-start text-sm">
                  <i className="fas fa-angle-right text-primary mr-2 mt-1"></i>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center">
              <i className="fas fa-clock text-blue-500 mr-3"></i>
              Thời Gian
            </h3>
            <p className="text-lg">{data.duration}</p>
            <p className="text-sm text-gray-600 mt-2">
              Thời gian cụ thể tùy thuộc vào nhu cầu và lịch trình của doanh nghiệp
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center">
              <i className="fas fa-certificate text-yellow-500 mr-3"></i>
              Chứng Chỉ
            </h3>
            <p className="text-lg font-medium text-primary">{data.certificate}</p>
            <p className="text-sm text-gray-600 mt-2">
              Được công nhận trên toàn quốc
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`bg-gradient-to-r ${data.bgColor} text-white rounded-2xl p-8 text-center shadow-xl`}>
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Bắt Đầu?</h2>
          <p className="text-xl mb-6 opacity-90">
            Kết nối với các đơn vị đào tạo uy tín ngay hôm nay
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onCreateRequestClick}
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg text-lg transform hover:scale-105"
            >
              <i className="fas fa-rocket mr-2"></i>
              Tạo Yêu Cầu Miễn Phí
            </button>
            <button
              onClick={() => onNavigate('requests')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all text-lg"
            >
              <i className="fas fa-search mr-2"></i>
              Tìm Đối Tác
            </button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            <i className="fas fa-shield-alt mr-2"></i>
            Miễn phí 100% - Không phí ẩn - Bảo mật thông tin
          </p>
        </div>

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-neutral-dark mb-4">
            Tại Sao Chọn SafetyConnect Cho {data.title}?
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              SafetyConnect là nền tảng kết nối hàng đầu giữa doanh nghiệp và các đơn vị đào tạo an toàn lao động chuyên nghiệp.
              Với mạng lưới hơn 50+ đối tác đào tạo uy tín trên toàn quốc, chúng tôi cam kết mang đến cho bạn:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 mb-4">
              <li className="flex items-start">
                <i className="fas fa-check-double text-green-500 mr-2 mt-1"></i>
                <span>Đơn vị đào tạo được kiểm duyệt kỹ lưỡng</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-double text-green-500 mr-2 mt-1"></i>
                <span>Giá cả cạnh tranh, minh bạch</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-double text-green-500 mr-2 mt-1"></i>
                <span>Chứng chỉ hợp lệ, đúng quy định</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-double text-green-500 mr-2 mt-1"></i>
                <span>Hỗ trợ tư vấn miễn phí 24/7</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Việc đào tạo {data.title.toLowerCase()} không chỉ là yêu cầu bắt buộc của pháp luật mà còn là trách nhiệm của mỗi doanh nghiệp
              trong việc bảo vệ người lao động. Hãy để SafetyConnect giúp bạn tìm được đơn vị đào tạo phù hợp nhất!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingLandingPage;

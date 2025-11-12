import React from 'react';
import TrainingRequestForm from '../components/TrainingRequestForm';
import { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const StatCard: React.FC<{ value: string; label: string; icon: string; gradient: string }> = ({ value, label, icon, gradient }) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}>
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <i className={`fas ${icon} text-3xl text-white`}></i>
        </div>
      </div>
      <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">{value}</p>
      <p className="text-sm md:text-base text-white/90 font-medium">{label}</p>
    </div>
  </div>
);

const ProcessStep: React.FC<{ number: string; title: string; description: string, gradient: string; icon: string }> = ({ number, title, description, gradient, icon }) => (
  <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
    <div className={`flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} text-white font-bold text-2xl mx-auto mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
      {number}
    </div>
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 mb-4`}>
      <i className={`fas ${icon} text-xl bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}></i>
    </div>
    <h3 className="text-xl font-bold text-neutral-dark mb-3 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
  </div>
);

const BenefitCard: React.FC<{ icon: string; title: string; description: string; gradient: string }> = ({ icon, title, description, gradient }) => (
    <div className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl h-full group overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
        <div className={`relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br ${gradient} mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
            <i className={`fas ${icon} text-4xl text-white`}></i>
        </div>
        <h3 className="font-bold text-neutral-dark mb-3 text-xl group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-orange-500/5 rounded-full blur-3xl transform translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
    </div>
);

const CourseCard: React.FC<{ icon: string; title: string; onClick?: () => void; gradient: string }> = ({ icon, title, onClick, gradient }) => (
    <div
        onClick={onClick}
        className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl cursor-pointer group overflow-hidden"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        <div className="relative z-10">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <i className={`fas ${icon} text-4xl text-white`}></i>
            </div>
            <h4 className="font-bold text-neutral-dark group-hover:text-white transition-colors text-lg mb-2">{title}</h4>
            <p className="text-xs text-gray-500 group-hover:text-white/90 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <i className="fas fa-arrow-right mr-1"></i>Xem chi tiết
            </p>
        </div>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const scrollToForm = () => {
    document.getElementById('create-request-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-orange-500 to-orange-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-white/40 rounded-full animate-ping delay-500"></div>
            <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping delay-1000"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-40 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <i className="fas fa-shield-alt text-white"></i>
            <span className="text-sm font-semibold text-white">Nền tảng kết nối đào tạo ATLD #1 Việt Nam</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            Nền tảng kết nối<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-white">
              Đào tạo An toàn Lao động
            </span>
          </h1>

          <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-10 text-white/95 leading-relaxed animate-fade-in-up delay-200">
            Kết nối doanh nghiệp với các đối tác đào tạo ATLD uy tín trên toàn quốc.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 animate-fade-in-up delay-300">
            <button
              onClick={scrollToForm}
              className="group bg-white text-primary font-bold py-4 px-10 rounded-xl shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
              Tạo Yêu Cầu Miễn Phí
            </button>
            <button
              onClick={() => onNavigate('requests')}
              className="group border-2 border-white/50 backdrop-blur-sm bg-white/10 text-white font-bold py-4 px-10 rounded-xl hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <i className="fas fa-list-ul group-hover:scale-110 transition-transform"></i>
              Xem Các Yêu Cầu
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <i className="fas fa-chevron-down text-white/60 text-2xl"></i>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-3">Con số ấn tượng</h2>
            <p className="text-gray-600">Những thành tựu đã đạt được</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <StatCard value="50+" label="Đối tác đào tạo" icon="fa-handshake" gradient="from-blue-500 to-blue-700" />
            <StatCard value="200+" label="Doanh nghiệp tin dùng" icon="fa-building" gradient="from-green-500 to-green-700" />
            <StatCard value="1000+" label="Học viên đã đào tạo" icon="fa-user-graduate" gradient="from-purple-500 to-purple-700" />
            <StatCard value="98%" label="Mức độ hài lòng" icon="fa-star" gradient="from-orange-500 to-orange-700" />
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              QUY TRÌNH
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">Quy trình hoạt động</h2>
            <p className="text-gray-600 text-lg">Minh bạch, rõ ràng cho cả Doanh nghiệp và Đối tác.</p>
          </div>

          <div className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-2xl shadow-lg">
                <i className="fas fa-building text-2xl"></i>
                <h3 className="text-2xl font-bold">Dành cho Doanh nghiệp</h3>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProcessStep number="1" title="Gửi yêu cầu" description="Điền form nhu cầu đào tạo chi tiết của doanh nghiệp." gradient="from-blue-500 to-blue-700" icon="fa-paper-plane" />
              <ProcessStep number="2" title="Nhận báo giá" description="Các đối tác uy tín gửi báo giá và chương trình phù hợp." gradient="from-blue-500 to-blue-700" icon="fa-file-invoice-dollar" />
              <ProcessStep number="3" title="So sánh & chọn" description="Lựa chọn đối tác có báo giá và năng lực phù hợp nhất." gradient="from-blue-500 to-blue-700" icon="fa-balance-scale" />
              <ProcessStep number="4" title="Ký hợp đồng" description="Ký kết và triển khai chương trình đào tạo hiệu quả." gradient="from-blue-500 to-blue-700" icon="fa-file-signature" />
            </div>
          </div>

          <div>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg">
                <i className="fas fa-chalkboard-teacher text-2xl"></i>
                <h3 className="text-2xl font-bold">Dành cho Đối tác Đào tạo</h3>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProcessStep number="1" title="Đăng ký" description="Tạo tài khoản và trở thành đối tác của nền tảng." gradient="from-green-500 to-green-700" icon="fa-user-plus" />
              <ProcessStep number="2" title="Nhận thông báo" description="Nhận thông báo về các yêu cầu đào tạo phù hợp." gradient="from-green-500 to-green-700" icon="fa-bell" />
              <ProcessStep number="3" title="Gửi báo giá" description="Gửi chương trình và báo giá chi tiết cho khách hàng." gradient="from-green-500 to-green-700" icon="fa-paper-plane" />
              <ProcessStep number="4" title="Triển khai" description="Thực hiện đào tạo chuyên nghiệp và nhận thanh toán." gradient="from-green-500 to-green-700" icon="fa-check-circle" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
       <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  LỢI ÍCH
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">Tại sao chọn SafetyConnect?</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">Giải pháp toàn diện cho nhu cầu đào tạo an toàn lao động của doanh nghiệp</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                <BenefitCard icon="fa-rocket" title="Kết nối nhanh chóng" description="Tiếp cận hàng chục đối tác đào tạo uy tín chỉ với một yêu cầu duy nhất, tiết kiệm thời gian tìm kiếm." gradient="from-blue-500 to-blue-700"/>
                <BenefitCard icon="fa-piggy-bank" title="Hoàn toàn miễn phí" description="Nền tảng miễn phí cho các doanh nghiệp có nhu cầu đào tạo, giúp tối ưu hóa chi phí." gradient="from-green-500 to-green-700"/>
                <BenefitCard icon="fa-star" title="Chất lượng đảm bảo" description="Tất cả đối tác đào tạo đều được xác minh năng lực và kinh nghiệm trước khi tham gia nền tảng." gradient="from-purple-500 to-purple-700"/>
            </div>
        </div>
      </section>

       {/* Popular Courses Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    KHÓA HỌC
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">Các khóa đào tạo phổ biến</h2>
                  <p className="text-gray-600 text-lg">Nhấn vào từng khóa để xem thông tin chi tiết</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  <CourseCard icon="fa-bolt" title="An toàn Điện" onClick={() => onNavigate('training-an-toan-dien')} gradient="from-yellow-500 to-yellow-700" />
                  <CourseCard icon="fa-hard-hat" title="An toàn Xây dựng" onClick={() => onNavigate('training-an-toan-xay-dung')} gradient="from-orange-500 to-orange-700" />
                  <CourseCard icon="fa-flask" title="An toàn Hóa chất" onClick={() => onNavigate('training-an-toan-hoa-chat')} gradient="from-purple-500 to-purple-700" />
                  <CourseCard icon="fa-fire-extinguisher" title="PCCC" onClick={() => onNavigate('training-pccc')} gradient="from-red-500 to-red-700" />
                  <CourseCard icon="fa-shipping-fast" title="Thiết bị Nâng" onClick={() => onNavigate('training-an-toan-thiet-bi-nang')} gradient="from-blue-500 to-blue-700" />
                  <CourseCard icon="fa-level-up-alt" title="Làm việc Trên cao" onClick={() => onNavigate('training-an-toan-lam-viec-tren-cao')} gradient="from-green-500 to-green-700" />
                  <CourseCard icon="fa-medkit" title="Sơ Cấp Cứu" onClick={() => onNavigate('training-so-cap-cuu')} gradient="from-pink-500 to-pink-700" />
              </div>
          </div>
      </section>


      {/* Form Section */}
      <section id="create-request-form" className="relative py-20 bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                  <div className="inline-block bg-gradient-to-r from-primary to-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    BẮT ĐẦU NGAY
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-4">Tạo yêu cầu đào tạo</h2>
                  <p className="text-gray-600 text-lg">Nhận báo giá từ nhiều đối tác uy tín trong vòng 24h</p>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                  <TrainingRequestForm />
              </div>
          </div>
      </section>
    </>
  );
};

export default HomePage;

import React from 'react';
import TrainingRequestForm from '../components/TrainingRequestForm';
import { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-bold text-primary">{value}</p>
    <p className="text-sm md:text-base text-neutral-dark mt-2">{label}</p>
  </div>
);

const ProcessStep: React.FC<{ number: string; title: string; description: string, colorClass: string }> = ({ number, title, description, colorClass }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center h-full">
    <div className={`flex items-center justify-center h-12 w-12 rounded-full ${colorClass} text-white font-bold text-xl mx-auto mb-4`}>{number}</div>
    <h3 className="text-lg font-semibold text-neutral-dark mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const BenefitCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center transition-transform hover:-translate-y-2 h-full">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
            <i className={`fas ${icon} text-3xl text-primary`}></i>
        </div>
        <h3 className="font-semibold text-neutral-dark mb-2 text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const CourseCard: React.FC<{ icon: string; title: string; onClick?: () => void }> = ({ icon, title, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer group"
    >
        <i className={`fas ${icon} text-5xl text-primary mb-4 group-hover:scale-110 transition-transform`}></i>
        <h4 className="font-bold text-neutral-dark group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="fas fa-arrow-right mr-1"></i>Xem chi tiết
        </p>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const scrollToForm = () => {
    document.getElementById('create-request-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-orange-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Nền tảng kết nối Đào tạo An toàn Lao động</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">Kết nối doanh nghiệp với các đối tác đào tạo ATLD uy tín trên toàn quốc.</p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <button onClick={scrollToForm} className="bg-white text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
              Tạo Yêu Cầu Miễn Phí
            </button>
            <button onClick={() => onNavigate('requests')} className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-primary transition duration-300">
              Xem Các Yêu Cầu
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="50+" label="Đối tác đào tạo" />
            <StatCard value="200+" label="Doanh nghiệp tin dùng" />
            <StatCard value="1000+" label="Học viên đã đào tạo" />
            <StatCard value="98%" label="Mức độ hài lòng" />
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">Quy trình hoạt động</h2>
            <p className="text-gray-600 mt-2">Minh bạch, rõ ràng cho cả Doanh nghiệp và Đối tác.</p>
          </div>
          
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-primary text-center mb-8">Dành cho Doanh nghiệp</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProcessStep number="1" title="Gửi yêu cầu" description="Điền form nhu cầu đào tạo chi tiết của doanh nghiệp." colorClass="bg-primary" />
              <ProcessStep number="2" title="Nhận báo giá" description="Các đối tác uy tín gửi báo giá và chương trình phù hợp." colorClass="bg-primary" />
              <ProcessStep number="3" title="So sánh & chọn" description="Lựa chọn đối tác có báo giá và năng lực phù hợp nhất." colorClass="bg-primary" />
              <ProcessStep number="4" title="Ký hợp đồng" description="Ký kết và triển khai chương trình đào tạo hiệu quả." colorClass="bg-primary" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-accent text-center mb-8">Dành cho Đối tác Đào tạo</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProcessStep number="1" title="Đăng ký" description="Tạo tài khoản và trở thành đối tác của nền tảng." colorClass="bg-accent" />
              <ProcessStep number="2" title="Nhận thông báo" description="Nhận thông báo về các yêu cầu đào tạo phù hợp." colorClass="bg-accent" />
              <ProcessStep number="3" title="Gửi báo giá" description="Gửi chương trình và báo giá chi tiết cho khách hàng." colorClass="bg-accent" />
              <ProcessStep number="4" title="Triển khai" description="Thực hiện đào tạo chuyên nghiệp và nhận thanh toán." colorClass="bg-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
       <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">Tại sao chọn SafetyConnect?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <BenefitCard icon="fa-rocket" title="Kết nối nhanh chóng" description="Tiếp cận hàng chục đối tác đào tạo uy tín chỉ với một yêu cầu duy nhất, tiết kiệm thời gian tìm kiếm."/>
                <BenefitCard icon="fa-piggy-bank" title="Hoàn toàn miễn phí" description="Nền tảng miễn phí cho các doanh nghiệp có nhu cầu đào tạo, giúp tối ưu hóa chi phí."/>
                <BenefitCard icon="fa-star" title="Chất lượng đảm bảo" description="Tất cả đối tác đào tạo đều được xác minh năng lực và kinh nghiệm trước khi tham gia nền tảng."/>
            </div>
        </div>
      </section>

       {/* Popular Courses Section */}
      <section className="py-16 bg-neutral-light">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">Các khóa đào tạo phổ biến</h2>
                  <p className="text-gray-600 mt-2">Nhấn vào từng khóa để xem thông tin chi tiết</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <CourseCard icon="fa-bolt" title="An toàn Điện" onClick={() => onNavigate('training-an-toan-dien')} />
                  <CourseCard icon="fa-hard-hat" title="An toàn Xây dựng" onClick={() => onNavigate('training-an-toan-xay-dung')} />
                  <CourseCard icon="fa-flask" title="An toàn Hóa chất" onClick={() => onNavigate('training-an-toan-hoa-chat')} />
                  <CourseCard icon="fa-fire-extinguisher" title="PCCC" onClick={() => onNavigate('training-pccc')} />
                  <CourseCard icon="fa-shipping-fast" title="Thiết bị Nâng" onClick={() => onNavigate('training-an-toan-thiet-bi-nang')} />
                  <CourseCard icon="fa-level-up-alt" title="Làm việc Trên cao" onClick={() => onNavigate('training-an-toan-lam-viec-tren-cao')} />
                  <CourseCard icon="fa-medkit" title="Sơ Cấp Cứu" onClick={() => onNavigate('training-so-cap-cuu')} />
              </div>
          </div>
      </section>


      {/* Form Section */}
      <section id="create-request-form" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
              <TrainingRequestForm />
          </div>
      </section>
    </>
  );
};

export default HomePage;

import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ProcessSection from '../components/home/ProcessSection';
import BenefitsSection from '../components/home/BenefitsSection';
import CoursesSection from '../components/home/CoursesSection';
import TrustedPartnersSection from '../components/home/TrustedPartnersSection';
import CTAFormSection from '../components/home/CTAFormSection';
import SEOHead from '../components/SEOHead';

const HomePage: React.FC = () => {
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    'name': 'SafetyConnect',
    'url': 'https://antoan.web.app/',
    'logo': 'https://raw.githubusercontent.com/thanhlv87/pic/refs/heads/main/connected.png',
    'description': 'Nền tảng kết nối doanh nghiệp với các đối tác đào tạo, huấn luyện an toàn lao động trực tuyến (online) và trực tiếp uy tín trên toàn quốc.',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'VN'
    },
    'offers': {
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': 'Huấn luyện an toàn lao động trực tuyến & online',
        'description': 'Học lý thuyết an toàn lao động online, làm bài kiểm tra trắc nghiệm trực tuyến linh hoạt, cấp chứng chỉ hợp chuẩn hợp quy.'
      }
    }
  };

  return (
    <>
      <SEOHead
        title="SafetyConnect - Nền Tảng Huấn Luyện An Toàn Lao Động Trực Tuyến & Online"
        description="Nền tảng kết nối doanh nghiệp với các đối tác huấn luyện an toàn lao động trực tuyến (online) và trực tiếp uy tín, chuyên nghiệp. Hỗ trợ đăng yêu cầu báo giá nhanh chóng."
        url="https://antoan.web.app/"
        keywords={[
          'huấn luyện an toàn lao động trực tuyến',
          'huấn luyện an toàn lao động online',
          'học an toàn lao động trực tuyến',
          'đào tạo an toàn lao động online',
          'chứng chỉ an toàn lao động',
          'SafetyConnect'
        ]}
        schema={homeSchema}
      />
      <HeroSection />
      <StatsSection />
      <ProcessSection />
      <BenefitsSection />
      <CoursesSection />
      <TrustedPartnersSection />
      <CTAFormSection />
    </>
  );
};

export default HomePage;

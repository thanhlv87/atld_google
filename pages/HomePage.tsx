import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ProcessSection from '../components/home/ProcessSection';
import BenefitsSection from '../components/home/BenefitsSection';
import CoursesSection from '../components/home/CoursesSection';
import TrustedPartnersSection from '../components/home/TrustedPartnersSection';
import CTAFormSection from '../components/home/CTAFormSection';

const HomePage: React.FC = () => {
  return (
    <>
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


import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-white py-6 mt-12">
      <div className="container mx-auto text-center px-4">
        <p>&copy; {new Date().getFullYear()} SafetyConnect. All Rights Reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Nền tảng kết nối Huấn luyện An toàn Lao động</p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { auth, firebase } from '../services/firebaseConfig';
import { Page, PartnerStatus } from '../App';

interface HeaderProps {
  user: firebase.User | null;
  isAdmin: boolean;
  onLoginClick: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  partnerStatus: PartnerStatus;
}

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, onNavigate, children }) => {
  const isActive = currentPage === page;
  const classes = `cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
    isActive
      ? 'text-primary'
      : 'text-neutral-dark hover:text-primary'
  }`;
  
  return (
    <a onClick={() => onNavigate(page)} className={classes}>
      {children}
    </a>
  );
};

const Header: React.FC<HeaderProps> = ({ user, isAdmin, onLoginClick, currentPage, onNavigate, partnerStatus }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      onNavigate('home'); // Redirect to home on logout
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  const handleCreateRequestClick = () => {
    const scrollToForm = () => {
        document.getElementById('create-request-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (currentPage === 'home') {
        scrollToForm();
    } else {
        onNavigate('home');
        // Wait for the home page to render before scrolling
        setTimeout(scrollToForm, 100);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          onClick={() => onNavigate('home')} 
          className="text-2xl font-bold text-primary cursor-pointer"
        >
          SafetyConnect
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <NavLink page="home" currentPage={currentPage} onNavigate={onNavigate}>Trang Chủ</NavLink>
          <NavLink page="requests" currentPage={currentPage} onNavigate={onNavigate}>Danh Sách Yêu Cầu</NavLink>
          <NavLink page="documents" currentPage={currentPage} onNavigate={onNavigate}>Tài Liệu</NavLink>
          {isAdmin && (
            <NavLink page="admin" currentPage={currentPage} onNavigate={onNavigate}>
                <span className="font-bold text-red-600">
                    <i className="fas fa-user-shield mr-1"></i> Quản Trị
                </span>
            </NavLink>
          )}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4">
           {!user && (
            <button
              onClick={handleCreateRequestClick}
              className="hidden md:block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300 text-sm font-medium"
            >
              Tạo Yêu Cầu
            </button>
           )}
          {user ? (
            <>
              {partnerStatus === 'pending' && (
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full hidden sm:block">
                    Chờ phê duyệt
                  </span>
              )}
              <span className="text-neutral-dark text-sm hidden sm:block">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm font-medium"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition duration-300 text-sm font-medium"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  type User
} from './services/firebaseConfig';
import { TrainingRequest } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { useUnreadMessages } from './hooks/useUnreadMessages';

// Lazy load pages for code splitting - pages are loaded only when needed
const HomePage = lazy(() => import('./pages/HomePage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const TrainingLandingPage = lazy(() => import('./pages/TrainingLandingPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const LoginModal = lazy(() => import('./components/LoginModal'));

export type Page = 'home' | 'requests' | 'documents' | 'admin' | 'chat' | 'blog' | 'blog-detail' |
  'training-an-toan-dien' | 'training-an-toan-xay-dung' | 'training-an-toan-hoa-chat' |
  'training-pccc' | 'training-an-toan-buc-xa' | 'training-quan-trac-moi-truong' |
  'training-danh-gia-phan-loai-lao-dong' | 'training-so-cap-cuu';
export type PartnerStatus = 'pending' | 'approved' | 'rejected' | null;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [page, setPage] = useState<Page>('home');
  const [blogPostId, setBlogPostId] = useState<string>('');

  // Get unread messages count
  const unreadCount = useUnreadMessages(user, isAdmin, partnerStatus);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false);
      setPartnerStatus(null);

      if (currentUser) {
        // Check for admin privileges
        const adminDocRef = doc(db, 'admins', currentUser.uid);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          setIsAdmin(true);
          setPage('admin'); // Auto-navigate to admin page on login
        } else {
          // If not admin, check for partner status
          const partnerDocRef = doc(db, 'partners', currentUser.uid);
          const partnerDoc = await getDoc(partnerDocRef);
          if (partnerDoc.exists()) {
            const partnerData = partnerDoc.data();
            setPartnerStatus(partnerData?.status || 'pending');
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const requestsCollection = collection(db, 'trainingRequests');
    const q = query(requestsCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const requests: TrainingRequest[] = [];
        querySnapshot.forEach((docSnap) => {
          requests.push({ id: docSnap.id, ...docSnap.data() } as TrainingRequest);
        });
        setTrainingRequests(requests);
        setLoadingRequests(false);
      },
      (error) => {
        console.error("Error fetching training requests: ", error);
        setLoadingRequests(false);
      }
    );

    return () => unsubscribe();
  }, []);
  
  const handleNavigate = (newPage: Page, postId?: string) => {
    // Prevent non-admins from accessing admin page
    if (newPage === 'admin' && !isAdmin) {
      setPage('home');
      return;
    }
    setPage(newPage);
    if (postId) {
      setBlogPostId(postId);
    }
  }

  const handleCreateRequestClick = () => {
    const scrollToForm = () => {
      document.getElementById('create-request-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (page === 'home') {
      scrollToForm();
    } else {
      setPage('home');
      // Wait for the home page to render before scrolling
      setTimeout(scrollToForm, 100);
    }
  };

  const renderPage = () => {
    // Check if it's a training landing page
    if (page.startsWith('training-')) {
      const trainingType = page.replace('training-', '');
      return (
        <TrainingLandingPage
          trainingType={trainingType}
          onNavigate={handleNavigate}
          onCreateRequestClick={handleCreateRequestClick}
        />
      );
    }

    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'requests':
        return (
          <RequestsPage
            requests={trainingRequests}
            user={user}
            loading={loadingRequests || loadingAuth}
            onLoginRequired={() => setLoginModalOpen(true)}
            partnerStatus={partnerStatus}
            onNavigate={handleNavigate}
          />
        );
      case 'documents':
        return <DocumentsPage isAdmin={isAdmin} />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage onNavigate={handleNavigate} />;
      case 'chat':
        return (
          <ChatPage
            user={user}
            isAdmin={isAdmin}
            partnerStatus={partnerStatus}
            onLoginRequired={() => setLoginModalOpen(true)}
          />
        );
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'blog-detail':
        return <BlogDetailPage postId={blogPostId} onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        user={user}
        isAdmin={isAdmin}
        onLoginClick={() => setLoginModalOpen(true)}
        currentPage={page}
        onNavigate={handleNavigate}
        partnerStatus={partnerStatus}
        unreadCount={unreadCount}
      />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner size="fullscreen" message="Đang tải..." />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer />
      {isLoginModalOpen && (
        <Suspense fallback={null}>
          <LoginModal onClose={() => setLoginModalOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
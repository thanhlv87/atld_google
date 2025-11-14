import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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

const LoginModal = lazy(() => import('./components/LoginModal'));

export type PartnerStatus = 'pending' | 'approved' | 'rejected' | null;

// Create a context to share auth and app state
export const AppContext = React.createContext<{
  user: User | null;
  isAdmin: boolean;
  partnerStatus: PartnerStatus;
  trainingRequests: TrainingRequest[];
  loadingAuth: boolean;
  loadingRequests: boolean;
  unreadCount: number;
  onLoginRequired: () => void;
}>({
  user: null,
  isAdmin: false,
  partnerStatus: null,
  trainingRequests: [],
  loadingAuth: true,
  loadingRequests: true,
  unreadCount: 0,
  onLoginRequired: () => {}
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const location = useLocation();

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

  // Get current page from location
  const getCurrentPage = (): string => {
    const pathname = location.pathname;
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/blog/')) return 'blog-detail';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname.startsWith('/requests')) return 'requests';
    if (pathname.startsWith('/documents')) return 'documents';
    if (pathname.startsWith('/chat')) return 'chat';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/training-')) return pathname.slice(1);
    return 'home';
  };

  // Context value for child pages
  const contextValue = {
    user,
    isAdmin,
    partnerStatus,
    trainingRequests,
    loadingAuth,
    loadingRequests,
    unreadCount,
    onLoginRequired: () => setLoginModalOpen(true)
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col font-sans">
        <Header
          user={user}
          isAdmin={isAdmin}
          onLoginClick={() => setLoginModalOpen(true)}
          currentPage={getCurrentPage()}
          partnerStatus={partnerStatus}
          unreadCount={unreadCount}
        />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner size="fullscreen" message="Đang tải..." />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        {isLoginModalOpen && (
          <Suspense fallback={null}>
            <LoginModal onClose={() => setLoginModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;
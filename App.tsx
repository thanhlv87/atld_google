import React, { useState, useEffect } from 'react';
import { auth, db, firebase } from './services/firebaseConfig';
import { TrainingRequest } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import RequestsPage from './pages/RequestsPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminPage from './pages/AdminPage';

export type Page = 'home' | 'requests' | 'documents' | 'admin';
export type PartnerStatus = 'pending' | 'approved' | 'rejected' | null;

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setIsAdmin(false);
      setPartnerStatus(null);

      if (currentUser) {
        // Check for admin privileges
        const adminDoc = await db.collection('admins').doc(currentUser.uid).get();
        if (adminDoc.exists) {
          setIsAdmin(true);
          setPage('admin'); // Auto-navigate to admin page on login
        } else {
          // If not admin, check for partner status
          const partnerDoc = await db.collection('partners').doc(currentUser.uid).get();
          if (partnerDoc.exists) {
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
    const q = db.collection('trainingRequests').orderBy('createdAt', 'desc');
    const unsubscribe = q.onSnapshot((querySnapshot) => {
      const requests: TrainingRequest[] = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as TrainingRequest);
      });
      setTrainingRequests(requests);
      setLoadingRequests(false);
    }, (error) => {
      console.error("Error fetching training requests: ", error);
      setLoadingRequests(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleNavigate = (newPage: Page) => {
    // Prevent non-admins from accessing admin page
    if (newPage === 'admin' && !isAdmin) {
      setPage('home');
      return;
    }
    setPage(newPage);
  }

  const renderPage = () => {
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
          />
        );
      case 'documents':
        return <DocumentsPage isAdmin={isAdmin} />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage onNavigate={handleNavigate} />;
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
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </div>
  );
};

export default App;
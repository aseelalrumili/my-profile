import { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import LoadingScreen from '../UI/LoadingScreen';
import ReadingProgress from '../UI/ReadingProgress';
import LoginModal from '../../../features/admin/components/LoginModal';
import type { AppData } from '../../../types';

const AdminPanel = lazy(() => import('../../../features/admin/components/AdminPanel'));

export default function PageLayout({ children, data, onDataUpdate }: { children: React.ReactNode; data?: AppData; onDataUpdate?: () => Promise<void> }) {
  const { isAdmin, login, logout } = useAuth();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(false);

  useEffect(() => {
    if (data?.profile?.themeColor) {
      document.documentElement.style.setProperty('--accent', data.profile.themeColor);
      const r = parseInt(data.profile.themeColor.slice(1, 3), 16);
      const g = parseInt(data.profile.themeColor.slice(3, 5), 16);
      const b = parseInt(data.profile.themeColor.slice(5, 7), 16);
      document.documentElement.style.setProperty('--accent-hover', `rgb(${Math.min(255, r + 15)}, ${Math.min(255, g + 15)}, ${Math.min(255, b + 15)})`);
    }
  }, [data?.profile?.themeColor]);

  return (
    <>
      {isAdminPanelVisible && isAdmin && data ? (
        <Suspense fallback={<LoadingScreen />}>
          <AdminPanel
            data={data}
            onClose={() => setIsAdminPanelVisible(false)}
            onDataUpdate={async () => { await onDataUpdate?.(); }}
            onLogout={() => { logout(); setIsAdminPanelVisible(false); }}
          />
        </Suspense>
      ) : (
        <>
          <ReadingProgress />
          <Navbar
            isAdmin={isAdmin}
            onAdminClick={() => isAdmin ? setIsAdminPanelVisible(true) : setIsLoginVisible(true)}
            onLogout={logout}
            resumeUrl={data?.profile?.resumeUrl}
            profile={data?.profile}
          />
          <div id="main-content">{children}</div>
          {data && <Footer data={data} />}
          <BackToTop />
          {isLoginVisible && (
            <LoginModal
              onSuccess={(token, email) => {
                login(token, email);
                setIsLoginVisible(false);
                setIsAdminPanelVisible(true);
              }}
              onClose={() => setIsLoginVisible(false)}
            />
          )}
        </>
      )}
    </>
  );
}

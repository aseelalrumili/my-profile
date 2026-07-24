import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './shared/components/Effects/PageTransition';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './shared/context/ThemeContext';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import { fetchAll, trackVisitor } from './api/api';
import type { AppData } from './types';
import LoadingScreen from './shared/components/UI/LoadingScreen';
import Navbar from './shared/components/Layout/Navbar';
import Hero from './features/portfolio/components/Hero';
import About from './features/portfolio/components/About';
import Experience from './features/portfolio/components/Experience';
import Skills from './features/portfolio/components/Skills';
import Projects from './features/portfolio/components/Projects';
import Certifications from './features/certifications/components/Certifications';
import Reviews from './features/reviews/components/Reviews';
import Footer from './shared/components/Layout/Footer';
import Contact from './features/portfolio/components/Contact';
import BackToTop from './shared/components/Layout/BackToTop';
import Particles from './shared/components/Effects/Particles';
import Page404 from './shared/components/UI/Page404';
import LoginModal from './features/admin/components/LoginModal';
import AdminPanel from './features/admin/components/AdminPanel';
import ReadingProgress from './shared/components/UI/ReadingProgress';
import ResumePage from './features/resume/components/ResumePage';
import CertificationsPage from './features/certifications/components/CertificationsPage';
import PortfolioPage from './features/portfolio/components/PortfolioPage';
import BlogPage from './features/blog/components/BlogPage';
import BlogPost from './features/blog/components/BlogPost';
import ErrorBoundary from './shared/components/Effects/ErrorBoundary';
import { fallbackData } from './fallbackData';

function PageLayout({ children, data }: { children: React.ReactNode; data?: AppData }) {
  const { isAdmin, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

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
      <ReadingProgress />
      <Navbar
        isAdmin={isAdmin}
        onAdminClick={() => isAdmin ? setShowAdmin(true) : setShowLogin(true)}
        onLogout={logout}
        resumeUrl={data?.profile?.resumeUrl}
      />
      {children}
      {data && <Footer data={data} />}
      <BackToTop />
      {showLogin && (
        <LoginModal
          onSuccess={(token, username) => {
            login(token, username);
            setShowLogin(false);
            setShowAdmin(true);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
      {showAdmin && isAdmin && data && (
        <AdminPanel
          data={data}
          onClose={() => setShowAdmin(false)}
          onDataUpdate={() => fetchAll().then(() => {})}
          onLogout={() => { logout(); setShowAdmin(false); }}
        />
      )}
    </>
  );
}

function HomePage({ data, onLoadData }: { data: AppData; onLoadData: () => Promise<void> }) {
  useEffect(() => { trackVisitor('/').catch(() => {}); }, []);

  return (
    <PageLayout data={data}>
      <Particles />
      <Hero data={data} />
      <div id="about"><About data={data} /></div>
      <div id="skills"><Skills data={data} /></div>
      <div id="projects"><Projects data={data} /></div>
      <div id="experience"><Experience data={data} /></div>
      <div id="certifications"><Certifications data={data} limit={3} /></div>
      <Reviews settings={data.settings} />
      <div id="contact"><Contact data={data} /></div>
    </PageLayout>
  );
}

function AppRoutes() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const location = useLocation();

  const loadData = async () => {
    try {
      setError(false);
      const d = await fetchAll();
      setData(d);
    } catch (e) {
      console.error('Failed to load data', e);
      if (!data) setData(fallbackData);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <LoadingScreen />;
  if (!data) return <LoadingScreen />;

  return (
    <AnimatePresence mode="wait">
      {error && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--warning)', color: '#000', textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}>
          Backend unavailable — showing demo data
        </div>
      )}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={data ? <HomePage data={data} onLoadData={loadData} /> : <LoadingScreen />} />
        <Route path="/resume" element={
          <PageLayout data={data ?? undefined}>
            <PageTransition>
              {data ? <ResumePage data={data} /> : <LoadingScreen />}
            </PageTransition>
          </PageLayout>
        } />
        <Route path="/certifications" element={
          <PageLayout>
            <PageTransition>
              <CertificationsPage />
            </PageTransition>
          </PageLayout>
        } />
        <Route path="/portfolio" element={
          <PageLayout data={data ?? undefined}>
            <PageTransition>
              {data ? <PortfolioPage data={data} /> : <LoadingScreen />}
            </PageTransition>
          </PageLayout>
        } />
        <Route path="/blog" element={
          <PageLayout>
            <PageTransition>
              <BlogPage />
            </PageTransition>
          </PageLayout>
        } />
        <Route path="/blog/:slug" element={
          <PageLayout>
            <PageTransition>
              <BlogPost />
            </PageTransition>
          </PageLayout>
        } />
        <Route path="/contact" element={
          <PageLayout data={data ?? undefined}>
            <PageTransition>
              <div className="section">
                {data ? <Contact data={data} /> : <LoadingScreen />}
              </div>
            </PageTransition>
          </PageLayout>
        } />
        <Route path="*" element={
          <PageLayout>
            <PageTransition>
              <Page404 />
            </PageTransition>
          </PageLayout>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter basename="/my-profile" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

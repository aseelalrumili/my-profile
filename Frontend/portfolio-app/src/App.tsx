import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
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
import Testimonials from './features/testimonials/components/Testimonials';
import Footer from './shared/components/Layout/Footer';
import Contact from './features/portfolio/components/Contact';
import BackToTop from './shared/components/Layout/BackToTop';
import Particles from './shared/components/Effects/Particles';
import ErrorBoundary from './shared/components/Effects/ErrorBoundary';
import LoginModal from './features/admin/components/LoginModal';
import ReadingProgress from './shared/components/UI/ReadingProgress';
import SplashScreen from './shared/components/UI/SplashScreen';
import SectionDivider from './shared/components/Effects/SectionDivider';
import { fallbackData } from './fallbackData';
import { useTranslation } from 'react-i18next';

const AdminPanel = lazy(() => import('./features/admin/components/AdminPanel'));
const ResumePage = lazy(() => import('./features/resume/components/ResumePage'));
const CertificationsPage = lazy(() => import('./features/certifications/components/CertificationsPage'));
const PortfolioPage = lazy(() => import('./features/portfolio/components/PortfolioPage'));
const BlogPage = lazy(() => import('./features/blog/components/BlogPage'));
const BlogPost = lazy(() => import('./features/blog/components/BlogPost'));
const Page404 = lazy(() => import('./shared/components/UI/Page404'));

function SkipToContent() {
  const { t } = useTranslation();
  return (
    <a href="#main-content" style={{ position: 'absolute', top: '-100%', left: 0, zIndex: 10000, background: 'var(--accent)', color: '#fff', padding: '0.5rem 1rem', textDecoration: 'none', fontWeight: 600 }}
      onFocus={(e) => { e.currentTarget.style.top = '0'; }}
      onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
    >
      {t('common.skipToContent')}
    </a>
  );
}

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
      {showAdmin && isAdmin && data ? (
        <Suspense fallback={<LoadingScreen />}>
          <AdminPanel
            data={data}
            onClose={() => setShowAdmin(false)}
            onDataUpdate={() => fetchAll().then(() => {})}
            onLogout={() => { logout(); setShowAdmin(false); }}
          />
        </Suspense>
      ) : (
        <>
          <ReadingProgress />
          <Navbar
            isAdmin={isAdmin}
            onAdminClick={() => isAdmin ? setShowAdmin(true) : setShowLogin(true)}
            onLogout={logout}
            resumeUrl={data?.profile?.resumeUrl}
            profile={data?.profile}
          />
          <div id="main-content">{children}</div>
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
        </>
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
      <SectionDivider />
      <div id="about"><About data={data} /></div>
      <SectionDivider style="dots" />
      <div id="skills"><Skills data={data} /></div>
      <SectionDivider />
      <div id="projects"><Projects data={data} /></div>
      <SectionDivider style="dots" />
      <div id="experience"><Experience data={data} /></div>
      <SectionDivider />
      <div id="certifications"><Certifications data={data} limit={3} /></div>
      <SectionDivider style="dots" />
      <Reviews settings={data.settings} />
      <Testimonials data={data} />
      <SectionDivider />
      <div id="contact"><Contact data={data} /></div>
    </PageLayout>
  );
}

function AppRoutes() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

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

  if (!splashDone) return <SplashScreen onComplete={handleSplashComplete} />;
  if (loading) return <LoadingScreen />;
  if (!data) return <LoadingScreen />;

  return (
    <AnimatePresence mode="wait">
      {error && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--warning)', color: '#000', textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}>
          Backend unavailable — showing demo data
        </div>
      )}
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter basename="/my-profile" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <SkipToContent />
            <AppRoutes />
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

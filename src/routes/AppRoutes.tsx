import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../shared/components/Effects/PageTransition';
import LoadingScreen from '../shared/components/UI/LoadingScreen';
import SplashScreen from '../shared/components/UI/SplashScreen';
import ErrorBoundary from '../shared/components/Effects/ErrorBoundary';
import PageLayout from '../shared/components/Layout/PageLayout';
import { fetchAll } from '../api/api';
import type { AppData } from '../types';
import { fallbackData } from '../fallbackData';
import Hero from '../features/portfolio/components/Hero';
import About from '../features/portfolio/components/About';
import Experience from '../features/portfolio/components/Experience';
import Skills from '../features/portfolio/components/Skills';
import Projects from '../features/portfolio/components/Projects';
import Certifications from '../features/certifications/components/Certifications';
import Reviews from '../features/reviews/components/Reviews';
import Testimonials from '../features/testimonials/components/Testimonials';
import Contact from '../features/portfolio/components/Contact';
import Particles from '../shared/components/Effects/Particles';
import SectionDivider from '../shared/components/Effects/SectionDivider';
import { trackVisitor } from '../api/api';

const ResumePage = lazy(() => import('../features/resume/components/ResumePage'));
const CertificationsPage = lazy(() => import('../features/certifications/components/CertificationsPage'));
const PortfolioPage = lazy(() => import('../features/portfolio/components/PortfolioPage'));
const BlogPage = lazy(() => import('../features/blog/components/BlogPage'));
const BlogPost = lazy(() => import('../features/blog/components/BlogPost'));
const Page404 = lazy(() => import('../shared/components/UI/Page404'));

function HomePage({ data, onDataUpdate }: { data: AppData; onDataUpdate?: () => Promise<void> }) {
  useEffect(() => { trackVisitor('/').catch(() => {}); }, []);

  return (
    <PageLayout data={data} onDataUpdate={onDataUpdate}>
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

export default function AppRoutes() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const location = useLocation();

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  const loadData = async () => {
    try {
      setHasError(false);
      const fetchedData = await fetchAll();
      setData(fetchedData);
    } catch (error) {
      console.error('Failed to load data', error);
      if (!data) setData(fallbackData);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (!splashDone) return <SplashScreen onComplete={handleSplashComplete} />;
  if (isLoading) return <LoadingScreen />;
  if (!data) return <LoadingScreen />;

  return (
    <AnimatePresence mode="wait">
      {hasError && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--warning)', color: '#000', textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 500 }}>
          Backend unavailable — showing demo data
        </div>
      )}
      <Suspense fallback={<LoadingScreen />}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage data={data} onDataUpdate={loadData} />} />
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

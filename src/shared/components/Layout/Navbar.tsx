import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiDownload, FiLock, FiHome, FiUser, FiBriefcase, FiMail } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface Props {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  resumeUrl?: string;
  profile?: { firstName?: string; firstNameAr?: string; fullName?: string; fullNameAr?: string };
}

export default function Navbar({ isAdmin, onAdminClick, onLogout, resumeUrl, profile }: Props) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dir, setDir] = useState(() => document.documentElement.dir || 'ltr');
  const isAr = dir === 'rtl';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDir(document.documentElement.dir || 'ltr');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const toggleLang = useCallback(() => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  }, [i18n]);

  const handleHashLink = useCallback((href: string) => {
    if (location.pathname === '/') {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onAdminClick();
      }
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdminClick, isMobileMenuOpen]);

  const navItems = [
    { key: 'about', href: '#about' },
    { key: 'work', href: '#projects' },
    { key: 'certifications', href: '#certifications' },
  ];

  return (
    <>
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label={t('nav.home')}>
        <Link to="/" className="nav-logo">{isAr ? (profile?.firstNameAr || profile?.firstName || profile?.fullNameAr?.split(' ')[0] || 'ASIL') : (profile?.firstName || profile?.fullName?.split(' ')[0] || 'ASIL')}</Link>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.key}>
              <a href={item.href} onClick={(e) => { e.preventDefault(); handleHashLink(item.href); }}>{t(`nav.${item.key}`)}</a>
            </li>
          ))}
          <li><Link to="/blog" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent-secondary)' }}>{t('nav.blog')}</Link></li>
          <li><Link to="/resume" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent-secondary)' }}>{t('resume.title')}</Link></li>
        </ul>

        <div className="nav-controls">
          <button className="nav-lang-btn" onClick={toggleLang} aria-label={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}>
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
          <button className="nav-toggle-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="nav-cv-btn" download>
              <FiDownload style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
              {t('nav.downloadCv')}
            </a>
          )}
          <button className="nav-admin-btn" onClick={onAdminClick} title={t('nav.dashboard')}>
            <FiLock />
          </button>
          <button className="hamburger" onClick={() => setIsMobileMenuOpen(true)} aria-label={isAr ? 'فتح القائمة' : 'Open menu'} aria-expanded={isMobileMenuOpen}>
            <FiMenu />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label={t('admin.close')}>
                <FiX />
              </button>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
              {navItems.map((item) => (
                <a key={item.key} href={item.href} onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); handleHashLink(item.href); }}>
                  {t(`nav.${item.key}`)}
                </a>
              ))}
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.blog')}</Link>
              <Link to="/resume" onClick={() => setIsMobileMenuOpen(false)}>{t('resume.title')}</Link>
              <div className="mobile-menu-controls">
                <button className="nav-lang-btn" onClick={toggleLang}>
                  {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>
                <button className="nav-toggle-btn" onClick={toggleTheme}>
                  {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Mobile Navigation */}
      <nav className="mobile-bottom-nav" aria-label={isAr ? 'تنقل الهاتف' : 'Mobile navigation'}>
        <a href="#about" className="mobile-bottom-nav-item" onClick={(e) => { e.preventDefault(); handleHashLink('#about'); }}>
          <FiUser size={20} />
          <span>{t('nav.about')}</span>
        </a>
        <a href="#projects" className="mobile-bottom-nav-item" onClick={(e) => { e.preventDefault(); handleHashLink('#projects'); }}>
          <FiBriefcase size={20} />
          <span>{t('nav.work')}</span>
        </a>
        <Link to="/" className="mobile-bottom-nav-item mobile-bottom-nav-home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FiHome size={22} />
        </Link>
        <Link to="/resume" className="mobile-bottom-nav-item">
          <FiDownload size={20} />
          <span>{t('resume.title')}</span>
        </Link>
        <a href="#contact" className="mobile-bottom-nav-item" onClick={(e) => { e.preventDefault(); handleHashLink('#contact'); }}>
          <FiMail size={20} />
          <span>{t('nav.contact')}</span>
        </a>
      </nav>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiDownload, FiLock } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface Props {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  resumeUrl?: string;
}

export default function Navbar({ isAdmin, onAdminClick, onLogout, resumeUrl }: Props) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleHashLink = (href: string) => {
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
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onAdminClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdminClick]);

  const navItems = [
    { key: 'about', href: '#about' },
    { key: 'work', href: '#projects' },
    { key: 'certifications', href: '#certifications' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">ASIL</Link>

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
          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
            <FiMenu />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: isAr ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={isAr ? { left: 0, right: 'auto', borderLeft: 'none', borderRight: '1px solid var(--border)' } : undefined}
            >
              <button className="mobile-menu-close" onClick={() => setMobileOpen(false)} aria-label="Close menu" style={isAr ? { left: '1.25rem', right: 'auto' } : undefined}>
                <FiX />
              </button>
              <Link to="/" onClick={() => setMobileOpen(false)}>{t('nav.home')}</Link>
              {navItems.map((item) => (
                <a key={item.key} href={item.href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); handleHashLink(item.href); }}>
                  {t(`nav.${item.key}`)}
                </a>
              ))}
              <Link to="/blog" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent-secondary)' }} onClick={() => setMobileOpen(false)}>{t('nav.blog')}</Link>
              <Link to="/resume" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent-secondary)' }} onClick={() => setMobileOpen(false)}>{t('resume.title')}</Link>
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
    </>
  );
}

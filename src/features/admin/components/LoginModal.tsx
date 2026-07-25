import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { login as apiLogin } from '../../../api/api';

interface Props {
  onSuccess: (token: string, email: string) => void;
  onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>('input, button:not([disabled])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      onSuccess(result.token, result.email);
    } catch {
      setError(t('admin.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <motion.div
        ref={modalRef}
        className="admin-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t('admin.login')}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>{t('admin.login')}</h2>
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">{t('admin.email')}</label>
            <input id="login-email" ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">{t('admin.password')}</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('admin.signingIn') : t('admin.signIn')}
          </button>
          <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={onClose}>
            {t('admin.cancel')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

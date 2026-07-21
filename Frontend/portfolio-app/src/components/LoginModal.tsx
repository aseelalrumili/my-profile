import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { login as apiLogin } from '../api/api';

interface Props {
  onSuccess: (token: string, username: string) => void;
  onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: Props) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiLogin(username, password);
      onSuccess(result.token, result.username);
    } catch {
      setError(t('admin.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <motion.div
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
            <label htmlFor="login-username">{t('admin.username')}</label>
            <input id="login-username" ref={usernameRef} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
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

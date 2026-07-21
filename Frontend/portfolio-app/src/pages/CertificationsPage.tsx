import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchCertifications } from '../api/api';
import type { Certification } from '../types';
import Lightbox from '../components/Lightbox';
import LazyImage from '../components/LazyImage';

export default function CertificationsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [certs, setCerts] = useState<Certification[]>([]);
  const [filter, setFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertifications()
      .then(setCerts)
      .catch(() => setError(t('certsPage.loadError') || 'Failed to load certifications.'))
      .finally(() => setLoading(false));
  }, [t]);

  const categories = ['All', ...new Set(certs.map((c) => c.category).filter(Boolean))];
  const filtered = filter === 'All' ? certs : certs.filter((c) => c.category === filter);

  return (
    <main className="section">
      <Link to="/" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Home
      </Link>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('certsPage.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('certsPage.subtitle')}
      </motion.p>

      {loading ? (
        <div className="certs-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cert-card" style={{ pointerEvents: 'none' }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--border)', marginBottom: '1rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: '1rem', width: '70%', background: 'var(--border)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: '0.85rem', width: '50%', background: 'var(--border)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: '0.75rem', width: '80%', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>{error}</p>
      ) : (
        <>
          {categories.length > 1 && (
            <div className="certs-filter">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat || 'All')}
                >
                  {cat === 'All' ? t('projects.filterAll') : cat}
                </button>
              ))}
            </div>
          )}

          <div className="certs-grid">
            {filtered.map((cert, idx) => (
              <motion.div
                key={cert.id}
                className="cert-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                {cert.logoUrl ? (
                  <LazyImage
                    src={cert.logoUrl}
                    alt={cert.issuer}
                    className="cert-card-image"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setLightboxImage(cert.logoUrl!)}
                  />
                ) : (
                  <div className="cert-card-image cert-card-image-placeholder">&#128203;</div>
                )}
                <h3>{isAr && cert.nameAr ? cert.nameAr : cert.name}</h3>
                <div className="cert-issuer">{isAr && cert.issuerAr ? cert.issuerAr : cert.issuer}</div>
                <div className="cert-dates">
                  {cert.issueDate && `${t('certifications.issued')}: ${cert.issueDate}`}
                  {cert.expiryDate && ` | ${t('certifications.expires')}: ${cert.expiryDate}`}
                  {!cert.expiryDate && ` | ${t('certifications.noExpiry')}`}
                </div>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                    {t('certifications.viewCredential')} &rarr;
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}
    </main>
  );
}

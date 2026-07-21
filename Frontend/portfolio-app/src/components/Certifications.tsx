import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { AppData } from '../types';
import Lightbox from './Lightbox';
import LazyImage from './LazyImage';

export default function Certifications({ data, limit }: { data: AppData; limit?: number }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const certs = data.certifications || [];
  const [filter, setFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = ['All', ...new Set(certs.map((c) => c.category).filter(Boolean))];
  const filtered = (filter === 'All' ? certs : certs.filter((c) => c.category === filter)).slice(0, limit || Infinity);

  return (
    <section className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('certifications.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('certifications.subtitle')}
      </motion.p>

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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            {cert.logoUrl ? (
              <LazyImage src={cert.logoUrl} alt={cert.issuer} className="cert-card-image"
                style={{ cursor: 'pointer' }} onClick={() => setLightboxImage(cert.logoUrl!)} />
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

      {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/certifications" className="btn btn-outline" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>
          {t('certifications.viewAll')}
        </Link>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchReviews, fetchReviewStats } from '../../../api/reviews';
import type { Review } from '../../../types';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import { useLocale } from '../../../shared/hooks/useLocale';
import ReviewForm from './ReviewForm';

const PAGE_SIZE = 3;

export default function Reviews({ settings }: { settings?: Record<string, string> }) {
  const { t } = useTranslation();
  const { isAr } = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const r = await fetchReviews();
      if (Array.isArray(r)) setReviews(r);
    } catch {}
    try {
      const s = await fetchReviewStats();
      if (s && typeof s.total === 'number') setStats(s);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleReviewSubmitted = async () => {
    setShowForm(false);
    await load();
    setVisibleCount(PAGE_SIZE);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return isAr
      ? date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })
      : date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderAvatar = (r: Review) => {
    if (r.avatarUrl) {
      return <img className="review-avatar-img" src={r.avatarUrl} alt={r.name} />;
    }
    return <div className="review-avatar">{r.name.charAt(0)}</div>;
  };

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  if (settings?.reviewsSectionVisible === 'false') return null;

  return (
    <section className="section" id="reviews">
      <SectionHeader title={t('reviews.title')} subtitle={t('reviews.subtitle')} />

      {stats.total > 0 && (
        <motion.div
          className="review-stats"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="review-stats-avg">{stats.average}</span>
          <span className="review-stats-stars">
            {Array.from({ length: 5 }, (_, i) => i < Math.round(stats.average) ? '\u2605' : '\u2606').join('')}
          </span>
          <span className="review-stats-count">
            {isAr ? `${stats.total} تقييم` : `${stats.total} reviews`}
          </span>
        </motion.div>
      )}

      <div className="reviews-list">
        <AnimatePresence>
          {visible.map((r, idx) => (
            <motion.div
              key={r.id}
              className="review-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.1, 0.3) }}
            >
              <div className="review-card-header">
                {renderAvatar(r)}
                <div className="review-meta">
                  <span className="review-author">{r.name}</span>
                  <span className="review-date">{formatDate(r.createdAt)}</span>
                </div>
                <div className="review-stars">
                  {Array.from({ length: 5 }, (_, i) => i < r.rating ? '\u2605' : '\u2606').join('')}
                </div>
              </div>
              <p className="review-comment">{r.comment}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.button
          className="review-load-more"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('reviews.loadMore')} ↓
        </motion.button>
      )}

      {!showForm && (
        <motion.button
          className="btn btn-primary review-add-btn"
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {t('reviews.addReview')}
        </motion.button>
      )}

      <AnimatePresence>
        {showForm && (
          <ReviewForm onSubmit={handleReviewSubmitted} onCancel={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}

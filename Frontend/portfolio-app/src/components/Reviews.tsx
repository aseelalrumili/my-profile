import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchReviews, fetchReviewStats, addReview } from '../api/reviews';
import type { Review } from '../types';

const PAGE_SIZE = 3;

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="review-star-input">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`review-star-btn ${s <= (hover || value) ? 'filled' : ''}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} stars`}
        >
          {s <= (hover || value) ? '\u2605' : '\u2606'}
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const [r, s] = await Promise.all([fetchReviews(), fetchReviewStats()]);
      setReviews(r);
      setStats(s);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      toast.warning(isAr ? 'اكمل جميع الحقول' : 'Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await addReview({ name: name.trim(), rating, comment: comment.trim() });
      toast.success(isAr ? 'تم إضافة تقييمك!' : 'Review submitted!');
      setName('');
      setRating(0);
      setComment('');
      setShowForm(false);
      await load();
      setVisibleCount(PAGE_SIZE);
    } catch {
      toast.error(isAr ? 'فشل إرسال التقييم' : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return isAr
      ? date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })
      : date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const visible = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;
  const allLoaded = !hasMore && reviews.length > 0;

  return (
    <section className="section" id="reviews">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('reviews.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('reviews.subtitle')}
      </motion.p>

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
                <div className="review-avatar">{r.name.charAt(0)}</div>
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

      {(reviews.length === 0 || allLoaded) && !showForm && (
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
          <motion.form
            className="review-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="review-form-title">{t('reviews.yourReview')}</h3>
            <input
              type="text"
              className="review-input"
              placeholder={t('reviews.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <div className="review-rating-row">
              <label>{t('reviews.rating')}:</label>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <textarea
              className="review-textarea"
              placeholder={t('reviews.commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="review-form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t('reviews.submitting') : t('reviews.submit')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                {t('reviews.cancel')}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}

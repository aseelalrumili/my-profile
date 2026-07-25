import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addReview } from '../../../api/reviews';
import { useLocale } from '../../../shared/hooks/useLocale';

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

export default function ReviewForm({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const { isAr } = useLocale();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      toast.warning(isAr ? 'اكمل جميع الحقول' : 'Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await addReview({ name: name.trim(), rating, comment: comment.trim(), avatarUrl: avatarUrl.trim() || undefined });
      toast.success(isAr ? 'تم إضافة تقييمك!' : 'Review submitted!');
      setName('');
      setRating(0);
      setComment('');
      setAvatarUrl('');
      onSubmit();
    } catch {
      toast.error(isAr ? 'فشل إرسال التقييم' : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        type="url"
        className="review-input"
        placeholder={isAr ? 'رابط الصورة (اختياري)' : 'Avatar URL (optional)'}
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />

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
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('reviews.cancel')}
        </button>
      </div>
    </motion.form>
  );
}

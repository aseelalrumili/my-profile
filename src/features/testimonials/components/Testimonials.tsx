import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { AppData } from '../../../types';
import LazyImage from '../../../shared/components/UI/LazyImage';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import { useLocale } from '../../../shared/hooks/useLocale';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: 5 }, (_, i) => (i < rating ? '\u2605' : '\u2606')).join('')}
    </div>
  );
}

export default function Testimonials({ data }: { data: AppData }) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();
  const testimonials = data.testimonials || [];
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrent((c) => (c + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const t_item = testimonials[current];

  return (
    <section className="section">
      <SectionHeader title={t('testimonials.title')} subtitle={t('testimonials.subtitle')} />

      <div className="testimonials-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={t_item.id}
            className="testimonial-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <StarRating rating={t_item.rating} />
            <p className="testimonial-content">&ldquo;{local(t_item, 'content')}&rdquo;</p>
            {t_item.avatarUrl ? (
              <LazyImage src={t_item.avatarUrl} alt={t_item.clientName} className="testimonial-avatar" />
            ) : (
              <div className="testimonial-avatar-placeholder">
                {local(t_item, 'clientName')?.charAt(0)}
              </div>
            )}
            <div className="testimonial-name">{local(t_item, 'clientName')}</div>
            <div className="testimonial-client-title">{local(t_item, 'clientTitle')}</div>
          </motion.div>
        </AnimatePresence>

        <div className="testimonial-dots" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonial-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

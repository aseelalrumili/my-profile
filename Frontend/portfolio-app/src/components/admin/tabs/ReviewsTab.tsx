import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import type { AppData, Review } from '../../../types';
import { fetchAllReviews, updateReview, deleteReview, approveReview } from '../../../api/reviews';
import { getErrorMessage } from '../helpers';

interface Props {
  data: AppData;
  onDataUpdate: () => Promise<void>;
}

export default function ReviewsTab({ data, onDataUpdate }: Props) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Review[]>([]);

  const load = async () => {
    try {
      const all = await fetchAllReviews();
      setItems(all);
    } catch {
      setItems(data.reviews || []);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveReview(id);
      toast.success(t('admin.reviewApproved'));
      await load();
      await onDataUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteReview(id);
      toast.success(t('admin.deleted'));
      await load();
      await onDataUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleToggle = async (id: number, current: boolean) => {
    try {
      await updateReview(id, { isApproved: !current });
      toast.success(t('admin.reviewApproved'));
      await load();
      await onDataUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
        {t('admin.reviews')} ({items.length})
      </h3>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('reviews.noReviews')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((r) => (
            <div
              key={r.id}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)',
                border: `1px solid ${r.isApproved ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                opacity: r.isApproved ? 1 : 0.7,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
              }}>
                {r.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem' }}>{r.name}</strong>
                  <span style={{ color: 'var(--accent)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {'\u2605'.repeat(r.rating)}{'\u2606'.repeat(5 - r.rating)}
                  </span>
                </div>
                <p style={{ margin: '0.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.comment}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {!r.isApproved && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(r.id)}>
                      {t('admin.approve')}
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => handleToggle(r.id, r.isApproved)}>
                    {r.isApproved ? t('admin.hide') : t('admin.approve')}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

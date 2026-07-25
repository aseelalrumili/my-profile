import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import type { AppData, Review } from '../../../../types';
import { fetchAllReviews, updateReview, deleteReview, approveReview } from '../../../../api/api';
import { getErrorMessage } from '../helpers';
import { useConfirmDelete } from '@/shared/hooks/useConfirmDelete';

interface Props {
  data: AppData;
  onDataUpdate: () => Promise<void>;
}

export default function ReviewsTab({ data, onDataUpdate }: Props) {
  const { t } = useTranslation();
  const confirmDelete = useConfirmDelete();
  const [items, setItems] = useState<Review[]>([]);
  const [isSectionVisible, setIsSectionVisible] = useState(
    data.settings?.reviewsSectionVisible !== 'false'
  );
  const [isSavingToggle, setIsSavingToggle] = useState(false);

  const load = async () => {
    try {
      const all = await fetchAllReviews();
      setItems(all);
    } catch {
      setItems(data.reviews || []);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    setIsSectionVisible(data.settings?.reviewsSectionVisible !== 'false');
  }, [data.settings]);

  const pending = items.filter((r) => !r.isApproved);
  const approved = items.filter((r) => r.isApproved);

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

  const handleHide = async (id: number) => {
    try {
      await updateReview(id, { isApproved: false });
      toast.success(t('admin.hide'));
      await load();
      await onDataUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirmDelete()) return;
    try {
      await deleteReview(id);
      toast.success(t('admin.deleted'));
      await load();
      await onDataUpdate();
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleSectionToggle = async () => {
    setIsSavingToggle(true);
    try {
      const newVal = !isSectionVisible;
      setIsSectionVisible(newVal);
      const { updateSettings } = await import('../../../../api/api');
      updateSettings({ reviewsSectionVisible: String(newVal) });
      toast.success(newVal ? t('admin.reviewApproved') : t('admin.hide'));
      await onDataUpdate();
    } catch {
      setIsSectionVisible(!isSectionVisible);
      toast.error(t('admin.failed'));
    } finally {
      setIsSavingToggle(false);
    }
  };

  const renderCard = (r: Review, isPending: boolean) => (
    <div
      key={r.id}
      className={`admin-review-card${isPending ? ' pending' : ''}`}
    >
      {r.avatarUrl ? (
        <img
          src={r.avatarUrl}
          alt={r.name}
          className="admin-review-avatar"
        />
      ) : (
        <div className="admin-review-avatar-placeholder">
          {r.name.charAt(0)}
        </div>
      )}
      <div className="admin-review-body">
        <div className="admin-review-header">
          <strong>{r.name}</strong>
          <div className="admin-review-actions">
            {!r.isApproved && (
              <button
                title={t('admin.approve')}
                className="admin-btn-icon"
                style={{ borderColor: 'var(--accent)' }}
                onClick={() => handleApprove(r.id)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                <FiEye size={15} />
              </button>
            )}
            {r.isApproved && (
              <button
                title={t('admin.hide')}
                className="admin-btn-icon"
                style={{ borderColor: 'var(--accent-secondary)' }}
                onClick={() => handleHide(r.id)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-secondary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                <FiEyeOff size={15} />
              </button>
            )}
            <button
              title={t('admin.delete')}
              className="admin-btn-icon"
              style={{ borderColor: '#e74c3c' }}
              onClick={() => handleDelete(r.id)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
        <div style={{ margin: '0.25rem 0' }}>
          <span className="admin-review-stars">
            {'\u2605'.repeat(r.rating)}{'\u2606'.repeat(5 - r.rating)}
          </span>
        </div>
        <p className="admin-review-comment">{r.comment}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="admin-section-header">
        <h3 className="admin-section-title">
          {t('admin.reviews')} ({items.length})
        </h3>
        <label className="admin-toggle-label">
          <input
            type="checkbox"
            checked={isSectionVisible}
            onChange={handleSectionToggle}
            disabled={isSavingToggle}
          />
          {t('admin.reviewsSection')}
        </label>
      </div>

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('reviews.noReviews')}</p>
      ) : (
        <div className="admin-flex-col" style={{ gap: '1.5rem' }}>
          {pending.length > 0 && (
            <div>
              <h4 className="admin-section-heading" style={{ color: 'var(--accent)' }}>
                {t('admin.pendingReviews')} ({pending.length})
              </h4>
              <div className="admin-flex-col" style={{ gap: '0.5rem' }}>
                {pending.map((r) => renderCard(r, true))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h4 className="admin-section-heading" style={{ color: 'var(--text-muted)' }}>
                {t('admin.approvedReviews')} ({approved.length})
              </h4>
              <div className="admin-flex-col" style={{ gap: '0.5rem' }}>
                {approved.map((r) => renderCard(r, false))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

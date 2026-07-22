import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import type { AppData, Review } from '../../../types';
import { fetchAllReviews, updateReview, deleteReview, approveReview } from '../../../api/reviews';
import { getErrorMessage } from '../helpers';

interface Props {
  data: AppData;
  onDataUpdate: () => Promise<void>;
}

const iconBtnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-primary)', cursor: 'pointer', transition: 'all 0.15s',
};

export default function ReviewsTab({ data, onDataUpdate }: Props) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Review[]>([]);
  const [sectionVisible, setSectionVisible] = useState(
    data.settings?.reviewsSectionVisible !== 'false'
  );
  const [savingToggle, setSavingToggle] = useState(false);

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
    setSectionVisible(data.settings?.reviewsSectionVisible !== 'false');
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

  const handleSectionToggle = async () => {
    setSavingToggle(true);
    try {
      const newVal = !sectionVisible;
      setSectionVisible(newVal);
      const { API } = await import('../../../api/client');
      await API.put('/settings', {
        ...data.settings,
        reviewsSectionVisible: String(newVal),
      });
      toast.success(newVal ? t('admin.reviewApproved') : t('admin.hide'));
      await onDataUpdate();
    } catch {
      setSectionVisible(!sectionVisible);
      toast.error(t('admin.failed'));
    } finally {
      setSavingToggle(false);
    }
  };

  const renderCard = (r: Review, isPending: boolean) => (
    <div
      key={r.id}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        background: isPending ? 'rgba(201, 168, 76, 0.08)' : 'var(--bg-primary)',
        border: `1px solid ${isPending ? 'var(--accent)' : 'var(--border)'}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
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
          <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
            {!r.isApproved && (
              <button
                title={t('admin.approve')}
                style={{ ...iconBtnBase, borderColor: 'var(--accent)' }}
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
                style={{ ...iconBtnBase, borderColor: 'var(--accent-secondary)' }}
                onClick={() => handleHide(r.id)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-secondary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                <FiEyeOff size={15} />
              </button>
            )}
            <button
              title={t('admin.delete')}
              style={{ ...iconBtnBase, borderColor: '#e74c3c' }}
              onClick={() => handleDelete(r.id)}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>
            {'\u2605'.repeat(r.rating)}{'\u2606'.repeat(5 - r.rating)}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.comment}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', margin: 0 }}>
          {t('admin.reviews')} ({items.length})
        </h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
          <input
            type="checkbox"
            checked={sectionVisible}
            onChange={handleSectionToggle}
            disabled={savingToggle}
            style={{ accentColor: 'var(--accent)' }}
          />
          {t('admin.reviewsSection')}
        </label>
      </div>

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('reviews.noReviews')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {pending.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('admin.pendingReviews')} ({pending.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pending.map((r) => renderCard(r, true))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('admin.approvedReviews')} ({approved.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {approved.map((r) => renderCard(r, false))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

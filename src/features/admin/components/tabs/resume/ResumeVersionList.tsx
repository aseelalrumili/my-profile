import { useTranslation } from 'react-i18next';
import { FiPlus, FiCopy, FiTrash2, FiStar, FiEdit3 } from 'react-icons/fi';
import type { ResumeVersion } from '@/core/types/resume';

interface Props {
  filtered: ResumeVersion[];
  editingId: string | null;
  isAr: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isLoading: boolean;
}

export default function ResumeVersionList({
  filtered,
  editingId,
  isAr,
  onSelect,
  onCreate,
  onClone,
  onDelete,
  onSetDefault,
  isLoading,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="admin-flex-col" style={{ gap: '0.5rem' }}>
      {filtered.map(v => (
        <div
          key={v.id}
          className={v.id === editingId ? 'admin-version-card active' : 'admin-version-card'}
          onClick={() => onSelect(v.id)}
        >
          <div className="admin-version-info">
            <FiEdit3 size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div className="admin-version-name">
                {v.name}
              </div>
              <div className="admin-version-meta">
                {new Date(v.updatedAt).toLocaleDateString(isAr ? 'ar' : 'en')}
              </div>
            </div>
            {v.isDefault && (
              <span className="admin-version-badge">
                {t('resume.default')}
              </span>
            )}
          </div>

          <div className="admin-flex" style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            {!v.isDefault && (
              <button
                className="admin-btn-sm"
                onClick={() => onSetDefault(v.id)}
                title={t('resume.setDefault')}
              >
                <FiStar size={14} />
              </button>
            )}
            <button
              className="admin-btn-sm"
              onClick={() => onClone(v.id)}
              title={t('resume.clone')}
            >
              <FiCopy size={14} />
            </button>
            <button
              className="admin-btn-sm"
              onClick={() => onDelete(v.id)}
              title={t('resume.delete')}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

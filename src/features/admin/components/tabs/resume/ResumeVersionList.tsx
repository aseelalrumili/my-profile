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
  loading: boolean;
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
  loading,
}: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {filtered.map(v => (
        <div
          key={v.id}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: v.id === editingId ? 'var(--accent-bg, rgba(37,99,235,0.08))' : 'var(--bg-secondary)',
            border: `1px solid ${v.id === editingId ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onClick={() => onSelect(v.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <FiEdit3 size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(v.updatedAt).toLocaleDateString(isAr ? 'ar' : 'en')}
              </div>
            </div>
            {v.isDefault && (
              <span style={{
                fontSize: '0.7rem', padding: '2px 8px',
                background: 'var(--accent)', color: '#fff',
                borderRadius: '999px', flexShrink: 0,
              }}>
                {t('resume.default')}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            {!v.isDefault && (
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                onClick={() => onSetDefault(v.id)}
                title={t('resume.setDefault')}
              >
                <FiStar size={14} />
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              onClick={() => onClone(v.id)}
              title={t('resume.clone')}
            >
              <FiCopy size={14} />
            </button>
            <button
              className="btn btn-danger btn-sm"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
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

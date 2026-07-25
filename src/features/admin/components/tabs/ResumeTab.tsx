import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiPlus, FiCopy, FiTrash2, FiStar, FiEdit3, FiDownload, FiFileText } from 'react-icons/fi';
import type { AppData } from '@/types';
import type { ResumeSettings, ResumeVersion } from '@/core/types/resume';
import { defaultResumeSettings, defaultAtsSettings } from './resume/defaultSettings';
import ResumeEditor from './resume/ResumeEditor';
import ResumePreview from './resume/ResumePreview';
import ResumePDF from './resume/ResumePDF';
import {
  fetchResumeVersions, createResumeVersion, updateResumeVersion,
  deleteResumeVersion, cloneResumeVersion, setDefaultResume,
} from '@/api/resume';

interface Props { data: AppData; onDataUpdate?: () => Promise<void> }

function dedupVersions(arr: ResumeVersion[]): ResumeVersion[] {
  const seen = new Set<string>();
  return arr.filter(v => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
}

export default function ResumeTab({ data, onDataUpdate }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeTab, setActiveTab] = useState<'ats' | 'regular'>('regular');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const creatingRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSettingsRef = useRef<{ id: string; settings: ResumeSettings } | null>(null);

  const flushSave = useCallback(async () => {
    const pending = pendingSettingsRef.current;
    if (!pending) return;
    pendingSettingsRef.current = null;
    await updateResumeVersion(pending.id, { settings: pending.settings });
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      flushSave();
    };
  }, [flushSave]);

  const loadVersions = useCallback(async () => {
    const v = await fetchResumeVersions();
    setVersions(dedupVersions(v));
    setLoading(false);
  }, []);

  useEffect(() => { loadVersions(); }, [loadVersions]);

  const filtered = versions.filter(v => v.type === activeTab);
  const editing = editingId ? versions.find(v => v.id === editingId) : undefined;

  const handleTabSwitch = (tab: 'ats' | 'regular') => {
    setActiveTab(tab);
    if (editingId) {
      const editingVersion = versions.find(v => v.id === editingId);
      if (editingVersion && editingVersion.type !== tab) {
        setEditingId(null);
      }
    }
  };

  const handleCreate = async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    try {
      const name = isAr
        ? (activeTab === 'ats' ? 'سيرة ذاتية ATS جديدة' : 'سيرة ذاتية جديدة')
        : (activeTab === 'ats' ? 'New ATS Resume' : 'New Resume');
      const settings = activeTab === 'ats'
        ? { ...defaultAtsSettings, sections: [...defaultAtsSettings.sections] }
        : { ...defaultResumeSettings, sections: [...defaultResumeSettings.sections] };
      const v = await createResumeVersion(name, activeTab, settings);
      setVersions(prev => dedupVersions([...prev, v]));
      setEditingId(v.id);
      toast.success(t('resume.versionCreated'));
      onDataUpdate?.();
    } finally {
      creatingRef.current = false;
    }
  };

  const handleSaveSettings = useCallback((settings: ResumeSettings) => {
    const currentId = editingId;
    if (!currentId) return;
    setVersions(prev => prev.map(x => x.id === currentId ? { ...x, settings, updatedAt: new Date().toISOString() } : x));
    pendingSettingsRef.current = { id: currentId, settings };
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      flushSave();
    }, 600);
  }, [editingId, flushSave]);

  const handleSaveName = async (id: string, name: string) => {
    const v = await updateResumeVersion(id, { name });
    setVersions(prev => prev.map(x => x.id === v.id ? v : x));
    toast.success(t('resume.saved'));
  };

  const handleClone = async (id: string) => {
    const source = versions.find(v => v.id === id);
    if (!source) return;
    const newName = isAr ? `${source.name} (نسخة)` : `${source.name} (Copy)`;
    const v = await cloneResumeVersion(id, newName);
    setVersions(prev => dedupVersions([...prev, v]));
    toast.success(t('resume.versionCloned'));
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    await deleteResumeVersion(id);
    setVersions(prev => prev.filter(v => v.id !== id));
    if (editingId === id) setEditingId(null);
    toast.success(t('resume.versionDeleted'));
    onDataUpdate?.();
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultResume(id);
    setVersions(prev => prev.map(v =>
      v.type === (versions.find(x => x.id === id)?.type)
        ? { ...v, isDefault: v.id === id }
        : v
    ));
    toast.success(t('resume.defaultSet'));
    onDataUpdate?.();
  };

  const handleRefreshPreview = () => {
    setPreviewKey(k => k + 1);
    setShowPreview(true);
  };

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          display: 'flex', gap: '0.5rem', marginBottom: '1rem',
          alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
              &larr; {t('resume.backToList')}
            </button>
            <EditingName
              name={editing.name}
              onSave={(name) => handleSaveName(editing.id, name)}
              isAr={isAr}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {editing.type === 'ats' ? (
              <ResumePDF data={data} settings={editing.settings} />
            ) : (
              <ResumePDF data={data} settings={editing.settings} />
            )}
            {editing.type === 'ats' && (
              <button className="btn btn-secondary btn-sm" onClick={() => {
                const el = document.getElementById('resume-admin-preview');
                if (!el) return;
                const text = el.innerText;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${editing.name}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <FiFileText style={{ marginRight: 4 }} /> {t('resume.exportText')}
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => { handleRefreshPreview(); }}>
              👁 {t('resume.preview')}
            </button>
            {editing.type === 'ats' && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '4px 8px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                ATS Mode
              </span>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: showPreview ? '320px 1fr' : '1fr',
          gap: '1rem',
          flex: 1,
          minHeight: 0,
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <ResumeEditor
              settings={editing.settings}
              onChange={(s) => handleSaveSettings(s)}
              isAts={editing.type === 'ats'}
            />
          </div>

          {showPreview && (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'auto',
              padding: 'var(--space-4)',
            }}>
              <ResumePreview key={previewKey} data={data} settings={editing.settings} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 1rem', fontSize: 'var(--fs-lg)' }}>
        {t('resume.builder')}
      </h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['regular', 'ats'] as const).map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => handleTabSwitch(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab === 'ats' ? 'ATS System' : t('resume.regularSystem')}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {filtered.length} {isAr ? 'نسخة' : 'versions'}
        </span>
        <button className="btn btn-primary btn-sm" onClick={handleCreate}>
          <FiPlus style={{ marginRight: 4 }} /> {t('resume.createNew')}
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('loading')}</p>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem 1rem',
          background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
          border: '1px dashed var(--border)',
        }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {isAr ? 'لا توجد نسخ بعد' : 'No versions yet'}
          </p>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            <FiPlus style={{ marginRight: 4 }} /> {t('resume.createNew')}
          </button>
        </div>
      ) : (
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
              onClick={() => setEditingId(v.id)}
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
                    onClick={() => handleSetDefault(v.id)}
                    title={t('resume.setDefault')}
                  >
                    <FiStar size={14} />
                  </button>
                )}
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  onClick={() => handleClone(v.id)}
                  title={t('resume.clone')}
                >
                  <FiCopy size={14} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  onClick={() => handleDelete(v.id)}
                  title={t('resume.delete')}
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditingName({ name, onSave, isAr }: { name: string; onSave: (n: string) => void; isAr: boolean }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  if (!editing) {
    return (
      <span
        style={{ fontWeight: 500, fontSize: '0.95rem', cursor: 'pointer' }}
        onClick={() => { setEditing(true); setValue(name); }}
      >
        {name}
      </span>
    );
  }

  return (
    <form onSubmit={e => { e.preventDefault(); if (value.trim()) { onSave(value.trim()); setEditing(false); } }} style={{ display: 'flex', gap: '0.25rem' }}>
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => { if (value.trim()) { onSave(value.trim()); setEditing(false); } else setEditing(false); }}
        style={{ padding: '2px 6px', fontSize: '0.95rem', fontWeight: 500, border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)' }}
      />
    </form>
  );
}

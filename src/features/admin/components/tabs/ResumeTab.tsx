import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiPlus, FiFileText } from 'react-icons/fi';
import type { AppData } from '@/types';
import type { ResumeSettings, ResumeVersion } from '@/core/types/resume';
import { defaultResumeSettings, defaultAtsSettings } from './resume/defaultSettings';
import ResumeEditor from './resume/ResumeEditor';
import ResumePreview from './resume/ResumePreview';
import ResumePDF from './resume/ResumePDF';
import EditingName from './resume/EditingName';
import ResumeVersionList from './resume/ResumeVersionList';
import {
  fetchResumeVersions, createResumeVersion, updateResumeVersion,
  deleteResumeVersion, cloneResumeVersion, setDefaultResume,
} from '@/api/resume';
import { useConfirmDelete } from '@/shared/hooks/useConfirmDelete';
import { getErrorMessage } from '../helpers';

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
  const confirmDelete = useConfirmDelete();
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [activeTab, setActiveTab] = useState<'ats' | 'regular'>('regular');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const creatingRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSettingsRef = useRef<{ id: string; settings: ResumeSettings } | null>(null);

  const flushSave = useCallback(async () => {
    const pending = pendingSettingsRef.current;
    if (!pending) return;
    pendingSettingsRef.current = null;
    try {
      await updateResumeVersion(pending.id, { settings: pending.settings });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  }, [t]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      flushSave();
    };
  }, [flushSave]);

  const loadVersions = useCallback(async () => {
    try {
      const v = await fetchResumeVersions();
      setVersions(dedupVersions(v));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

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
    if (!confirmDelete()) return;
    try {
      await deleteResumeVersion(id);
      setVersions(prev => prev.filter(v => v.id !== id));
      if (editingId === id) setEditingId(null);
      toast.success(t('resume.versionDeleted'));
      onDataUpdate?.();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultResume(id);
      setVersions(prev => prev.map(v =>
        v.type === (versions.find(x => x.id === id)?.type)
          ? { ...v, isDefault: v.id === id }
          : v
      ));
      toast.success(t('resume.defaultSet'));
      onDataUpdate?.();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, t('admin.failed')));
    }
  };

  const handleRefreshPreview = () => {
    setPreviewKey(k => k + 1);
    setIsPreviewVisible(true);
  };

  if (editing) {
    return (
      <div className="admin-flex-col" style={{ height: '100%' }}>
        <div className="admin-flex-between" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div className="admin-flex-center">
            <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
              &larr; {t('resume.backToList')}
            </button>
            <EditingName
              name={editing.name}
              onSave={(name) => handleSaveName(editing.id, name)}
              isAr={isAr}
            />
          </div>
          <div className="admin-flex-center">
            <ResumePDF data={data} settings={editing.settings} />
            {editing.type === 'ats' && (
              <button className="btn btn-secondary btn-sm" onClick={() => {
                const previewElement = document.getElementById('resume-admin-preview');
                if (!previewElement) return;
                const text = previewElement.innerText;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const anchorElement = document.createElement('a');
                anchorElement.href = url;
                anchorElement.download = `${editing.name}.txt`;
                anchorElement.click();
                URL.revokeObjectURL(url);
              }}>
                <FiFileText style={{ marginRight: 4 }} /> {t('resume.exportText')}
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => { handleRefreshPreview(); }}>
              👁 {t('resume.preview')}
            </button>
            {editing.type === 'ats' && (
              <span className="admin-btn-sm">ATS Mode</span>
            )}
          </div>
        </div>

        <div className={`admin-editor-layout ${isPreviewVisible ? 'side-by-side' : 'full'}`}>
          <div className="admin-editor-panel">
            <ResumeEditor
              settings={editing.settings}
              onChange={(s) => handleSaveSettings(s)}
              isAts={editing.type === 'ats'}
            />
          </div>

          {isPreviewVisible && (
            <div className="admin-preview-container">
              <ResumePreview key={previewKey} data={data} settings={editing.settings} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-flex-col" style={{ height: '100%' }}>
      <h3 className="admin-section-title" style={{ marginBottom: '1rem' }}>
        {t('resume.builder')}
      </h3>

      <div className="admin-tab-bar">
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

      <div className="admin-flex-between" style={{ marginBottom: '1rem' }}>
        <span className="admin-section-count">
          {filtered.length} {isAr ? 'نسخة' : 'versions'}
        </span>
        <button className="btn btn-primary btn-sm" onClick={handleCreate}>
          <FiPlus style={{ marginRight: 4 }} /> {t('resume.createNew')}
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('loading')}</p>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <p>
            {isAr ? 'لا توجد نسخ بعد' : 'No versions yet'}
          </p>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            <FiPlus style={{ marginRight: 4 }} /> {t('resume.createNew')}
          </button>
        </div>
      ) : (
        <ResumeVersionList
          filtered={filtered}
          editingId={editingId}
          isAr={isAr}
          onSelect={(id) => setEditingId(id)}
          onCreate={handleCreate}
          onClone={handleClone}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

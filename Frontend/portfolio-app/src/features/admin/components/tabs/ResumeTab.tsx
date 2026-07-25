import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { AppData } from '../../../../types';
import type { ResumeSettings } from '../../../../types/resume';
import { defaultResumeSettings, STORAGE_KEY } from './resume/defaultSettings';
import ResumeEditor from './resume/ResumeEditor';
import ResumePreview from './resume/ResumePreview';
import ResumePDF from './resume/ResumePDF';

interface Props {
  data: AppData;
}

function loadSettings(): ResumeSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultResumeSettings,
        ...parsed,
        layout: { ...defaultResumeSettings.layout, ...parsed.layout },
        colors: { ...defaultResumeSettings.colors, ...parsed.colors },
        fonts: { ...defaultResumeSettings.fonts, ...parsed.fonts },
        sections: parsed.sections || defaultResumeSettings.sections,
      };
    }
  } catch {}
  return defaultResumeSettings;
}

export default function ResumeTab({ data }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [settings, setSettings] = useState<ResumeSettings>(loadSettings);
  const [previewKey, setPreviewKey] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success(t('resume.saved'));
  };

  const handleRefreshPreview = () => {
    setPreviewKey((k) => k + 1);
    setShowPreview(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '1rem',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
      }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: 'var(--fs-lg)' }}>
          {t('resume.builder')}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <ResumePDF data={data} settings={settings} isAr={isAr} />
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            💾 {t('resume.save')}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleRefreshPreview}>
            👁 {t('resume.preview')}
          </button>
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
          <ResumeEditor settings={settings} onChange={setSettings} />
        </div>

        {showPreview && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'auto',
            padding: 'var(--space-4)',
          }}>
            <ResumePreview key={previewKey} data={data} settings={settings} isAr={isAr} />
          </div>
        )}
      </div>
    </div>
  );
}

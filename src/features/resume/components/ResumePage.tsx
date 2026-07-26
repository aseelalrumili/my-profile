import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppData } from '@/types';
import type { ResumeSettings } from '@/core/types/resume';
import { defaultAtsSettings } from '@/features/admin/components/tabs/resume/defaultSettings';
import AtsResumeBuilder from './AtsResumeBuilder';
import RegularResumeBuilder from './RegularResumeBuilder';

interface Props {
  data: AppData | null;
}

export default function ResumePage({ data }: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'ats' | 'regular'>('ats');

  const settings: ResumeSettings = useMemo(() => {
    if (!data?.resumeVersions) return defaultAtsSettings;
    const versions = data.resumeVersions;
    const defaultVersion = versions.find(v => v.type === activeTab && v.isDefault);
    if (defaultVersion) return defaultVersion.settings;
    const fallback = versions.find(v => v.type === activeTab);
    if (fallback) return fallback.settings;
    return defaultAtsSettings;
  }, [data?.resumeVersions, activeTab]);

  if (!data) return <div className="section"><p>{t('loading')}</p></div>;

  return (
    <main className="resume-page" style={{ background: settings.colors.pageBg }}>
      <div className="resume-actions no-print" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['ats', 'regular'] as const).map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'ats' ? t('resume.ats') : t('resume.standard')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ats' ? (
        <AtsResumeBuilder data={data} settings={settings} />
      ) : (
        <RegularResumeBuilder data={data} settings={settings} />
      )}
    </main>
  );
}

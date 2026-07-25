import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLayout, FiDroplet, FiType, FiList, FiImage } from 'react-icons/fi';
import type { ResumeSettings } from '@/core/types/resume';
import LayoutTab from './tabs/LayoutTab';
import PhotoTab from './tabs/PhotoTab';
import ColorsTab from './tabs/ColorsTab';
import FontsTab from './tabs/FontsTab';
import SectionsTab from './tabs/SectionsTab';

interface Props {
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
  isAts?: boolean;
}

type EditorTab = 'layout' | 'colors' | 'fonts' | 'sections' | 'photo';

export default function ResumeEditor({ settings, onChange, isAts }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [tab, setTab] = useState<EditorTab>('layout');

  const update = <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const updateLayout = <K extends keyof ResumeSettings['layout']>(key: K, value: ResumeSettings['layout'][K]) => {
    update('layout', { ...settings.layout, [key]: value });
  };

  const updateColors = <K extends keyof ResumeSettings['colors']>(key: K, value: ResumeSettings['colors'][K]) => {
    update('colors', { ...settings.colors, [key]: value });
  };

  const updateFonts = <K extends keyof ResumeSettings['fonts']>(key: K, value: ResumeSettings['fonts'][K]) => {
    update('fonts', { ...settings.fonts, [key]: value });
  };

  const updateSections = (sections: ResumeSettings['sections']) => {
    update('sections', sections);
  };

  const allTabs: { key: EditorTab; icon: React.ReactNode; label: string }[] = [
    { key: 'layout', icon: <FiLayout />, label: t('resume.tab.layout') },
    { key: 'photo', icon: <FiImage />, label: t('resume.tab.photo') },
    { key: 'colors', icon: <FiDroplet />, label: t('resume.tab.colors') },
    { key: 'fonts', icon: <FiType />, label: t('resume.tab.fonts') },
    { key: 'sections', icon: <FiList />, label: t('resume.tab.sections') },
  ];
  const tabs = isAts
    ? allTabs.filter(t => t.key !== 'photo' && t.key !== 'colors')
    : allTabs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map((t_tab) => (
          <button key={t_tab.key} onClick={() => setTab(t_tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
              background: tab === t_tab.key ? 'var(--bg-primary)' : 'transparent',
              border: 'none', borderBottom: tab === t_tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t_tab.key ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 'var(--fs-xs)', whiteSpace: 'nowrap', fontWeight: tab === t_tab.key ? 600 : 400,
            }}>
            {t_tab.icon} {t_tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '12px 0', overflowY: 'auto', flex: 1 }}>
        {tab === 'layout' && <LayoutTab settings={settings} updateLayout={updateLayout} />}
        {tab === 'photo' && <PhotoTab settings={settings} updateLayout={updateLayout} />}
        {tab === 'colors' && <ColorsTab settings={settings} updateColors={updateColors} />}
        {tab === 'fonts' && <FontsTab settings={settings} updateFonts={updateFonts} />}
        {tab === 'sections' && <SectionsTab settings={settings} onSectionsChange={updateSections} isAr={isAr} />}
      </div>
    </div>
  );
}

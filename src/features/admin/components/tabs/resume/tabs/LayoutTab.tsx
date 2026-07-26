import { useTranslation } from 'react-i18next';
import type { ResumeSettings } from '@/core/types/resume';

interface Props {
  settings: ResumeSettings;
  updateLayout: <K extends keyof ResumeSettings['layout']>(key: K, value: ResumeSettings['layout'][K]) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--fs-xs)',
  color: 'var(--text-secondary)',
  marginBottom: 4,
  display: 'block',
};

export default function LayoutTab({ settings, updateLayout }: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>{t('resume.layout.type')}</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['single', 'two-column'] as const).map((type) => (
            <button key={type} className={`btn btn-sm ${settings.layout.type === type ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateLayout('type', type)}>
              {type === 'single' ? t('resume.layout.singleCol') : t('resume.layout.twoCol')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={labelStyle}>{t('resume.layout.pageMargin')}: {settings.layout.pageMargin}px</label>
        <input type="range" min={20} max={80} value={settings.layout.pageMargin}
          onChange={(e) => updateLayout('pageMargin', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.layout.sectionGap')}: {settings.layout.sectionGap}px</label>
        <input type="range" min={4} max={40} value={settings.layout.sectionGap}
          onChange={(e) => updateLayout('sectionGap', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.layout.sectionPadding')}: {settings.layout.sectionPadding}px</label>
        <input type="range" min={4} max={40} value={settings.layout.sectionPadding}
          onChange={(e) => updateLayout('sectionPadding', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.layout.borderRadius')}: {settings.layout.sectionBorderRadius}px</label>
        <input type="range" min={0} max={20} value={settings.layout.sectionBorderRadius}
          onChange={(e) => updateLayout('sectionBorderRadius', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
    </div>
  );
}

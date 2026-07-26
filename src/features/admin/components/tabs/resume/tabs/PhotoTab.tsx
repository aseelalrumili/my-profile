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

export default function PhotoTab({ settings, updateLayout }: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={settings.layout.showPhoto}
          onChange={(e) => updateLayout('showPhoto', e.target.checked)} id="showPhoto" />
        <label htmlFor="showPhoto" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text)' }}>{t('resume.photo.show')}</label>
      </div>
      {settings.layout.showPhoto && (
        <>
          <div>
            <label style={labelStyle}>{t('resume.photo.size')}: {settings.layout.photoSize}px</label>
            <input type="range" min={60} max={150} value={settings.layout.photoSize}
              onChange={(e) => updateLayout('photoSize', Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={labelStyle}>{t('resume.photo.shape')}</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['circle', 'square', 'rounded'] as const).map((shape) => (
                <button key={shape} className={`btn btn-sm ${settings.layout.photoShape === shape ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateLayout('photoShape', shape)}>
                  {t(`resume.photo.${shape}`)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

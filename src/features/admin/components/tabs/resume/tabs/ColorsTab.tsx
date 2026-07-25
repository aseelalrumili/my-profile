import { useTranslation } from 'react-i18next';
import type { ResumeSettings } from '@/core/types/resume';

interface Props {
  settings: ResumeSettings;
  updateColors: <K extends keyof ResumeSettings['colors']>(key: K, value: ResumeSettings['colors'][K]) => void;
}

export default function ColorsTab({ settings, updateColors }: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {([
        ['pageBg', t('resume.colors.pageBg')],
        ['sectionBg', t('resume.colors.sectionBg')],
        ['primaryText', t('resume.colors.primaryText')],
        ['secondaryText', t('resume.colors.secondaryText')],
        ['headingText', t('resume.colors.headingText')],
        ['accent', t('resume.colors.accent')],
        ['borderColor', t('resume.colors.borderColor')],
        ['skillBg', t('resume.colors.skillBg')],
        ['skillText', t('resume.colors.skillText')],
      ] as const).map(([key, label]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="color" value={settings.colors[key]}
            onChange={(e) => updateColors(key, e.target.value)}
            style={{ width: 32, height: 28, border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

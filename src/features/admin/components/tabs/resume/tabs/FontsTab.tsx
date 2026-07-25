import { useTranslation } from 'react-i18next';
import type { ResumeSettings } from '@/core/types/resume';
import { FONT_OPTIONS } from '../defaultSettings';

interface Props {
  settings: ResumeSettings;
  updateFonts: <K extends keyof ResumeSettings['fonts']>(key: K, value: ResumeSettings['fonts'][K]) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  fontSize: 'var(--fs-xs)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--fs-xs)',
  color: 'var(--text-secondary)',
  marginBottom: 4,
  display: 'block',
};

export default function FontsTab({ settings, updateFonts }: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>{t('resume.fonts.family')}</label>
        <select value={settings.fonts.fontFamily} onChange={(e) => updateFonts('fontFamily', e.target.value)} style={inputStyle}>
          {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.titleSize')}: {settings.fonts.titleSize}px</label>
        <input type="range" min={18} max={36} value={settings.fonts.titleSize}
          onChange={(e) => updateFonts('titleSize', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.titleWeight')}</label>
        <select value={settings.fonts.titleWeight} onChange={(e) => updateFonts('titleWeight', Number(e.target.value))} style={inputStyle}>
          {[400, 500, 600, 700].map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.headingSize')}: {settings.fonts.headingSize}px</label>
        <input type="range" min={12} max={20} value={settings.fonts.headingSize}
          onChange={(e) => updateFonts('headingSize', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.headingWeight')}</label>
        <select value={settings.fonts.headingWeight} onChange={(e) => updateFonts('headingWeight', Number(e.target.value))} style={inputStyle}>
          {[500, 600, 700].map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.bodySize')}: {settings.fonts.bodySize}px</label>
        <input type="range" min={10} max={16} value={settings.fonts.bodySize}
          onChange={(e) => updateFonts('bodySize', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.lineHeight')}: {settings.fonts.bodyLineHeight}</label>
        <input type="range" min={1.2} max={2.5} step={0.1} value={settings.fonts.bodyLineHeight}
          onChange={(e) => updateFonts('bodyLineHeight', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
      <div>
        <label style={labelStyle}>{t('resume.fonts.metaSize')}: {settings.fonts.metaSize}px</label>
        <input type="range" min={9} max={13} value={settings.fonts.metaSize}
          onChange={(e) => updateFonts('metaSize', Number(e.target.value))} style={{ width: '100%' }} />
      </div>
    </div>
  );
}

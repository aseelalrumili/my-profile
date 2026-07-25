import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLayout, FiDroplet, FiType, FiList, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { ResumeSettings, ResumeSection } from '@/core/types/resume';
import { FONT_OPTIONS } from './defaultSettings';

interface Props {
  settings: ResumeSettings;
  onChange: (settings: ResumeSettings) => void;
}

type EditorTab = 'layout' | 'colors' | 'fonts' | 'sections' | 'photo';

export default function ResumeEditor({ settings, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [tab, setTab] = useState<EditorTab>('layout');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionTitleAr, setNewSectionTitleAr] = useState('');

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

  const updateSection = (id: string, field: keyof ResumeSection, value: any) => {
    update('sections', settings.sections.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection: ResumeSection = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: newSectionTitle,
      titleAr: newSectionTitleAr || newSectionTitle,
      visible: true,
      customContent: '',
      customContentAr: '',
    };
    update('sections', [...settings.sections, newSection]);
    setNewSectionTitle('');
    setNewSectionTitleAr('');
  };

  const removeSection = (id: string) => {
    update('sections', settings.sections.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...settings.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    update('sections', newSections);
  };

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

  const renderLayoutTab = () => (
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

  const renderPhotoTab = () => (
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

  const renderColorsTab = () => (
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

  const renderFontsTab = () => (
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

  const renderSectionsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {settings.sections.map((section, index) => (
        <div key={section.id} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
          background: 'var(--bg-primary)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <button onClick={() => moveSection(index, 'up')} disabled={index === 0}
            style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1, fontSize: 12 }}>▲</button>
          <button onClick={() => moveSection(index, 'down')} disabled={index === settings.sections.length - 1}
            style={{ background: 'none', border: 'none', cursor: index === settings.sections.length - 1 ? 'default' : 'pointer', opacity: index === settings.sections.length - 1 ? 0.3 : 1, fontSize: 12 }}>▼</button>
          <input type="checkbox" checked={section.visible}
            onChange={(e) => updateSection(section.id, 'visible', e.target.checked)} />
          <span style={{ flex: 1, fontSize: 'var(--fs-xs)', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isAr ? section.titleAr : section.title}
          </span>
          {section.type === 'custom' && (
            <button onClick={() => removeSection(section.id)}
              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {settings.sections.filter((s) => s.type === 'custom').map((section) => (
        <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 8px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <input placeholder={isAr ? 'العنوان بالعربي' : 'Title AR'} value={section.titleAr}
              onChange={(e) => updateSection(section.id, 'titleAr', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <input placeholder="Title EN" value={section.title}
              onChange={(e) => updateSection(section.id, 'title', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          </div>
          <textarea placeholder={isAr ? 'المحتوى...' : 'Content...'}
            value={isAr ? (section.customContentAr || '') : (section.customContent || '')}
            onChange={(e) => updateSection(section.id, isAr ? 'customContentAr' : 'customContent', e.target.value)}
            rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        <input placeholder={isAr ? 'عنوان القسم (AR)' : 'Section Title (AR)'} value={newSectionTitleAr}
          onChange={(e) => setNewSectionTitleAr(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        <input placeholder="Section Title (EN)" value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        <button className="btn btn-primary btn-sm" onClick={addSection} style={{ flexShrink: 0 }}><FiPlus /></button>
      </div>
    </div>
  );

  const tabs: { key: EditorTab; icon: React.ReactNode; label: string }[] = [
    { key: 'layout', icon: <FiLayout />, label: t('resume.tab.layout') },
    { key: 'photo', icon: <FiImage />, label: t('resume.tab.photo') },
    { key: 'colors', icon: <FiDroplet />, label: t('resume.tab.colors') },
    { key: 'fonts', icon: <FiType />, label: t('resume.tab.fonts') },
    { key: 'sections', icon: <FiList />, label: t('resume.tab.sections') },
  ];

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
        {tab === 'layout' && renderLayoutTab()}
        {tab === 'photo' && renderPhotoTab()}
        {tab === 'colors' && renderColorsTab()}
        {tab === 'fonts' && renderFontsTab()}
        {tab === 'sections' && renderSectionsTab()}
      </div>
    </div>
  );
}

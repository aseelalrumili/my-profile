import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import type { ResumeSettings, ResumeSection } from '@/core/types/resume';

interface Props {
  settings: ResumeSettings;
  onSectionsChange: (sections: ResumeSection[]) => void;
  isAr: boolean;
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

export default function SectionsTab({ settings, onSectionsChange, isAr }: Props) {
  const { t } = useTranslation();
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionTitleAr, setNewSectionTitleAr] = useState('');

  const updateSection = (id: string, field: keyof ResumeSection, value: string | number | boolean | undefined) => {
    onSectionsChange(settings.sections.map((s) => s.id === id ? { ...s, [field]: value } : s));
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
    onSectionsChange([...settings.sections, newSection]);
    setNewSectionTitle('');
    setNewSectionTitleAr('');
  };

  const removeSection = (id: string) => {
    onSectionsChange(settings.sections.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...settings.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    onSectionsChange(newSections);
  };

  return (
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
}

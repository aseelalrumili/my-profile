import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import type { ResumeSettings, ResumeSection } from '@/core/types/resume';

interface Props {
  settings: ResumeSettings;
  onSectionsChange: (sections: ResumeSection[]) => void;
  isAr: boolean;
}

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
    <div className="admin-flex-col" style={{ gap: 8 }}>
      {settings.sections.map((section, index) => (
        <div key={section.id} className="admin-section-item">
          <button className={`admin-arrow-btn ${index === 0 ? 'disabled' : ''}`}
            onClick={() => moveSection(index, 'up')} disabled={index === 0}>▲</button>
          <button className={`admin-arrow-btn ${index === settings.sections.length - 1 ? 'disabled' : ''}`}
            onClick={() => moveSection(index, 'down')} disabled={index === settings.sections.length - 1}>▼</button>
          <input type="checkbox" checked={section.visible}
            onChange={(e) => updateSection(section.id, 'visible', e.target.checked)} />
          <span className="admin-section-item-title">
            {isAr ? section.titleAr : section.title}
          </span>
          {section.type === 'custom' && (
            <button className="admin-delete-btn" onClick={() => removeSection(section.id)}>
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      ))}
      {settings.sections.filter((s) => s.type === 'custom').map((section) => (
        <div key={section.id} className="admin-card admin-flex-col" style={{ gap: 4 }}>
          <div className="admin-form-row">
            <input className="admin-form-input" placeholder={isAr ? 'العنوان بالعربي' : 'Title AR'} value={section.titleAr}
              onChange={(e) => updateSection(section.id, 'titleAr', e.target.value)} style={{ flex: 1 }} />
            <input className="admin-form-input" placeholder="Title EN" value={section.title}
              onChange={(e) => updateSection(section.id, 'title', e.target.value)} style={{ flex: 1 }} />
          </div>
          <textarea className="admin-form-textarea" placeholder={isAr ? 'المحتوى...' : 'Content...'}
            value={isAr ? (section.customContentAr || '') : (section.customContent || '')}
            onChange={(e) => updateSection(section.id, isAr ? 'customContentAr' : 'customContent', e.target.value)}
            rows={3} />
        </div>
      ))}
      <div className="admin-form-row">
        <input className="admin-form-input" placeholder={isAr ? 'عنوان القسم (AR)' : 'Section Title (AR)'} value={newSectionTitleAr}
          onChange={(e) => setNewSectionTitleAr(e.target.value)} style={{ flex: 1 }} />
        <input className="admin-form-input" placeholder="Section Title (EN)" value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)} style={{ flex: 1 }} />
        <button className="admin-btn-sm" onClick={addSection} style={{ flexShrink: 0 }}><FiPlus /></button>
      </div>
    </div>
  );
}

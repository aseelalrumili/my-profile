import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addEducation, updateEducation, deleteEducation } from '../../../api/api';
import type { AppData, Education } from '../../../types';
import { getErrorMessage, moveItem, SortArrows } from '../helpers';

export default function EducationTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Education[]>(data.education);
  const [form, setForm] = useState({ degree: '', degreeAr: '', institution: '', institutionAr: '', period: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!form.degree) return;
    try {
      if (editingId) { await updateEducation(editingId, { ...form, sortOrder: 0 }); setItems(items.map(i => i.id === editingId ? { ...i, ...form } : i)); setEditingId(null); }
      else { const newItem = await addEducation({ ...form, sortOrder: items.length }); setItems([...items, newItem]); }
      setForm({ degree: '', degreeAr: '', institution: '', institutionAr: '', period: '', description: '' });
      toast.success(t('admin.educationUpdated'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteEducation(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleSort = async (index: number, dir: 'up' | 'down') => {
    const newItems = moveItem(items, index, dir);
    setItems(newItems);
    for (const item of newItems) {
      try { await updateEducation(item.id, { sortOrder: item.sortOrder }); } catch {}
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <SortArrows onUp={() => handleSort(idx, 'up')} onDown={() => handleSort(idx, 'down')} canUp={idx > 0} canDown={idx < items.length - 1} />
            <div className="list-item-info"><h4>{item.degree}</h4><p>{item.institution} {item.period && `- ${item.period}`}</p></div>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ degree: item.degree, degreeAr: item.degreeAr || '', institution: item.institution || '', institutionAr: item.institutionAr || '', period: item.period || '', description: item.description || '' }); setEditingId(item.id); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{editingId ? t('admin.edit') : t('admin.add')}</h4>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.degree')}</label><input type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.degree')} ({t('admin.arSuffix')})</label><input type="text" value={form.degreeAr} onChange={(e) => setForm({ ...form, degreeAr: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.institution')}</label><input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.period')}</label><input type="text" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>{t('admin.description')}</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <button className="btn btn-primary" onClick={handleAdd}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

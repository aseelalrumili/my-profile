import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addExperience, updateExperience, deleteExperience } from '../../../api/api';
import type { AppData, Experience } from '../../../types';
import { getErrorMessage, moveItem, SortArrows } from '../helpers';

export default function ExperienceTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Experience[]>(data.experience);
  const [form, setForm] = useState({ title: '', titleAr: '', company: '', companyAr: '', period: '', description: '', descriptionAr: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!form.title) return;
    try {
      if (editingId) { await updateExperience(editingId, { ...form, sortOrder: 0 }); setItems(items.map(i => i.id === editingId ? { ...i, ...form } : i)); setEditingId(null); }
      else { const newItem = await addExperience({ ...form, sortOrder: items.length }); setItems([...items, newItem]); }
      setForm({ title: '', titleAr: '', company: '', companyAr: '', period: '', description: '', descriptionAr: '' });
      toast.success(t('admin.experienceUpdated'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteExperience(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleSort = async (index: number, dir: 'up' | 'down') => {
    const newItems = moveItem(items, index, dir);
    setItems(newItems);
    for (const item of newItems) {
      try { await updateExperience(item.id, { sortOrder: item.sortOrder }); } catch {}
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <SortArrows onUp={() => handleSort(idx, 'up')} onDown={() => handleSort(idx, 'down')} canUp={idx > 0} canDown={idx < items.length - 1} />
            <div className="list-item-info"><h4>{item.title}</h4><p>{item.company} {item.period && `- ${item.period}`}</p></div>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ title: item.title, titleAr: item.titleAr || '', company: item.company || '', companyAr: item.companyAr || '', period: item.period || '', description: item.description || '', descriptionAr: item.descriptionAr || '' }); setEditingId(item.id); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{editingId ? t('admin.edit') : t('admin.add')}</h4>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.title')}</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.title')} ({t('admin.arSuffix')})</label><input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.company')}</label><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.period')}</label><input type="text" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder={t('admin.periodPlaceholder')} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.description')}</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.description')} ({t('admin.arSuffix')})</label><textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

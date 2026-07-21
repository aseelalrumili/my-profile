import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addSkill, updateSkill, deleteSkill } from '../../../api/api';
import type { AppData, Skill } from '../../../types';
import { getErrorMessage, moveItem, SortArrows } from '../helpers';

export default function SkillsTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Skill[]>(data.skills);
  const [form, setForm] = useState({ name: '', nameAr: '', category: 'Technical', categoryAr: '', type: 'Design' as Skill['type'], percentage: 80 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!form.name) return;
    try {
      if (editingId) { await updateSkill(editingId, { ...form, sortOrder: 0 }); setItems(items.map(i => i.id === editingId ? { ...i, ...form } : i)); setEditingId(null); }
      else { const newItem = await addSkill({ ...form, sortOrder: items.length }); setItems([...items, newItem]); }
      setForm({ name: '', nameAr: '', category: 'Technical', categoryAr: '', type: 'Design', percentage: 80 });
      toast.success(t('admin.skillUpdated'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteSkill(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleSort = async (index: number, dir: 'up' | 'down') => {
    const newItems = moveItem(items, index, dir);
    setItems(newItems);
    for (const item of newItems) {
      try { await updateSkill(item.id, { sortOrder: item.sortOrder }); } catch {}
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="list-item">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SortArrows onUp={() => handleSort(idx, 'up')} onDown={() => handleSort(idx, 'down')} canUp={idx > 0} canDown={idx < items.length - 1} />
            <div className="list-item-info">
              <h4>{item.name} <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>{item.percentage}%</span></h4>
              <p>{item.category} <span style={{ color: 'var(--accent-secondary)', fontSize: '0.75rem' }}>({item.type === 'Design' ? t('skills.designTools') : t('skills.devTech')})</span></p>
            </div>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ name: item.name, nameAr: item.nameAr || '', category: item.category, categoryAr: item.categoryAr || '', type: item.type || 'Design', percentage: item.percentage }); setEditingId(item.id); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{editingId ? t('admin.edit') : t('admin.add')}</h4>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.name')}</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.name')} ({t('admin.arSuffix')})</label><input type="text" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('skills.skillType')}</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Skill['type'] })}>
              <option value="Design">{t('skills.designTools')}</option>
              <option value="Development">{t('skills.devTech')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('admin.category')}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {[{v:'Frontend',l:t('admin.frontend')},{v:'Backend',l:t('admin.backend')},{v:'Database',l:t('admin.database')},{v:'3D',l:'3D'},{v:'DevOps',l:'DevOps'},{v:'Design',l:t('admin.design')},{v:'Other',l:t('admin.other')}].map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label>{t('admin.percentage')} ({form.percentage}%)</label><input type="range" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: parseInt(e.target.value) })} style={{ width: '100%', marginTop: '0.5rem' }} /></div>
        <button className="btn btn-primary" onClick={handleAdd}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

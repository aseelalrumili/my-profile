import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addSocialLink, updateSocialLink, deleteSocialLink } from '../../../api/api';
import type { AppData, SocialLink } from '../../../types';
import { getErrorMessage, moveItem, SortArrows } from '../helpers';

export default function SocialTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<SocialLink[]>(data.socialLinks);
  const [form, setForm] = useState({ platform: '', url: '', icon: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!form.platform || !form.url) return;
    try {
      if (editingId) { await updateSocialLink(editingId, { ...form, sortOrder: items.length }); setItems(items.map(i => i.id === editingId ? { ...i, ...form } : i)); setEditingId(null); }
      else { const newItem = await addSocialLink({ ...form, sortOrder: items.length }); setItems([...items, newItem]); }
      setForm({ platform: '', url: '', icon: '' });
      toast.success(t('admin.socialLinkUpdated'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteSocialLink(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleSort = async (index: number, dir: 'up' | 'down') => {
    const newItems = moveItem(items, index, dir);
    setItems(newItems);
    for (const item of newItems) {
      try { await updateSocialLink(item.id, { sortOrder: item.sortOrder }); } catch {}
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="list-item">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SortArrows onUp={() => handleSort(idx, 'up')} onDown={() => handleSort(idx, 'down')} canUp={idx > 0} canDown={idx < items.length - 1} />
            <div className="list-item-info"><h4>{item.platform}</h4><p>{item.url}</p></div>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ platform: item.platform, url: item.url, icon: item.icon }); setEditingId(item.id); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{editingId ? t('admin.edit') : t('admin.add')}</h4>
        <div className="form-row">
          <div className="form-group">
            <label>{t('admin.platform')}</label>
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="">{t('admin.select')}</option>
              {['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'Dribbble', 'Behance', 'YouTube', 'Facebook', 'Email', 'Website'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group"><label>{t('admin.url')}</label><input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd} style={{ marginTop: '0.5rem' }}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

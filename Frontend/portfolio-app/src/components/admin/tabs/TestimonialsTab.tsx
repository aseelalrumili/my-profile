import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addTestimonial, updateTestimonial, deleteTestimonial } from '../../../api/api';
import type { AppData, Testimonial } from '../../../types';
import { getErrorMessage, moveItem, SortArrows } from '../helpers';

export default function TestimonialsTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Testimonial[]>(data.testimonials || []);
  const [form, setForm] = useState({ clientName: '', clientNameAr: '', clientTitle: '', clientTitleAr: '', avatarUrl: '', content: '', contentAr: '', rating: 5 });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { setItems(data.testimonials || []); }, [data.testimonials]);

  const handleAdd = async () => {
    if (!form.clientName || !form.content) return;
    try {
      if (editingId) { await updateTestimonial(editingId, { ...form, sortOrder: items.length }); setItems(items.map(i => i.id === editingId ? { ...i, ...form } : i)); setEditingId(null); }
      else { const newItem = await addTestimonial({ ...form, sortOrder: items.length }); setItems([...items, newItem]); }
      setForm({ clientName: '', clientNameAr: '', clientTitle: '', clientTitleAr: '', avatarUrl: '', content: '', contentAr: '', rating: 5 });
      toast.success(t('admin.testimonialSaved'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteTestimonial(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleSort = async (index: number, dir: 'up' | 'down') => {
    const newItems = moveItem(items, index, dir);
    setItems(newItems);
    for (const item of newItems) {
      try { await updateTestimonial(item.id, { sortOrder: item.sortOrder }); } catch {}
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="list-item">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SortArrows onUp={() => handleSort(idx, 'up')} onDown={() => handleSort(idx, 'down')} canUp={idx > 0} canDown={idx < items.length - 1} />
            <div className="list-item-info"><h4>{item.clientName} - {'\u2605'.repeat(item.rating)}</h4><p>{item.clientTitle}</p></div>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ clientName: item.clientName, clientNameAr: item.clientNameAr || '', clientTitle: item.clientTitle || '', clientTitleAr: item.clientTitleAr || '', avatarUrl: item.avatarUrl || '', content: item.content, contentAr: item.contentAr || '', rating: item.rating }); setEditingId(item.id); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{editingId ? t('admin.edit') : t('admin.add')}</h4>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.clientName')}</label><input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.clientTitle')}</label><input type="text" value={form.clientTitle} onChange={(e) => setForm({ ...form, clientTitle: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>{t('admin.content')}</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.rating')} (1-5)</label><input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} /></div>
          <div className="form-group"><label>{t('admin.avatarUrl')}</label><input type="url" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

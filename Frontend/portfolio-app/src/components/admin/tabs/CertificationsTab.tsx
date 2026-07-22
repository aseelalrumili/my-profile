import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addCertification, updateCertification, deleteCertification, fetchCertifications } from '../../../api/api';
import { getUploadUrl, uploadImage } from '../../../api/client';
import type { AppData, Certification } from '../../../types';
import { getErrorMessage, moveItem, SortArrows } from '../helpers';

export default function CertificationsTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<Certification[]>(data.certifications || []);
  const [form, setForm] = useState({ name: '', nameAr: '', issuer: '', issuerAr: '', issueDate: '', expiryDate: '', credentialUrl: '', logoUrl: '', category: '', categoryAr: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [existingImages, setExistingImages] = useState<{ url: string | null; index: number }[]>([]);

  useEffect(() => { setItems(data.certifications || []); }, [data.certifications]);

  const handleAdd = async () => {
    if (!form.name) return;
    try {
      const payload: any = { ...form, sortOrder: String(items.length) };
      for (let i = 0; i < 3; i++) {
        if (imageFiles[i]) {
          payload[`imageUrl${i + 1}`] = await uploadImage(imageFiles[i]!);
        } else if (existingImages[i]?.url) {
          payload[`imageUrl${i + 1}`] = existingImages[i].url;
        }
      }
      if (editingId) { await updateCertification(editingId, payload); setEditingId(null); }
      else { await addCertification(payload); }
      setForm({ name: '', nameAr: '', issuer: '', issuerAr: '', issueDate: '', expiryDate: '', credentialUrl: '', logoUrl: '', category: '', categoryAr: '' });
      setImageFiles([null, null, null]);
      setExistingImages([]);
      await onDataUpdate();
      setItems(await fetchCertifications());
      toast.success(t('admin.certificationSaved'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteCertification(id); await onDataUpdate(); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleSort = async (index: number, dir: 'up' | 'down') => {
    const newItems = moveItem(items, index, dir);
    setItems(newItems);
    for (const item of newItems) {
      try { await updateCertification(item.id, item); } catch {}
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="list-item">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SortArrows onUp={() => handleSort(idx, 'up')} onDown={() => handleSort(idx, 'down')} canUp={idx > 0} canDown={idx < items.length - 1} />
            <div className="list-item-info"><h4>{item.name}</h4><p>{item.issuer} {item.issueDate && `- ${item.issueDate}`}</p></div>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setForm({ name: item.name, nameAr: item.nameAr || '', issuer: item.issuer, issuerAr: item.issuerAr || '', issueDate: item.issueDate || '', expiryDate: item.expiryDate || '', credentialUrl: item.credentialUrl || '', logoUrl: item.logoUrl || '', category: item.category || '', categoryAr: item.categoryAr || '' });
              setExistingImages([
                { url: item.imageUrl1 || null, index: 0 },
                { url: item.imageUrl2 || null, index: 1 },
                { url: item.imageUrl3 || null, index: 2 },
              ]);
              setImageFiles([null, null, null]);
              setEditingId(item.id);
            }}>{t('admin.edit')}</button>
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
          <div className="form-group"><label>{t('admin.issuer')}</label><input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.issuer')} ({t('admin.arSuffix')})</label><input type="text" value={form.issuerAr} onChange={(e) => setForm({ ...form, issuerAr: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.issueDate')}</label><input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.expiryDate')}</label><input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.credentialUrl')}</label><input type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.logoUrl')}</label><input type="url" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.category')}</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.category')} ({t('admin.arSuffix')})</label><input type="text" value={form.categoryAr} onChange={(e) => setForm({ ...form, categoryAr: e.target.value })} /></div>
        </div>
        <div className="form-group">
          <label>{t('admin.imageUpload')}</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {existingImages[i]?.url && !imageFiles[i] ? (
                  <img src={getUploadUrl(existingImages[i].url!)} alt={`${t('admin.image')} ${i + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', display: 'block', marginBottom: '0.25rem' }} />
                ) : imageFiles[i] ? (
                  <img src={URL.createObjectURL(imageFiles[i]!)} alt={`${t('admin.preview')} ${i + 1}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--accent)', display: 'block', marginBottom: '0.25rem' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>{t('admin.image')} {i + 1}</div>
                )}
                <label style={{ fontSize: '0.7rem', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    const newFiles = [...imageFiles];
                    newFiles[i] = file;
                    setImageFiles(newFiles);
                    if (file) {
                      const newExisting = [...existingImages];
                      newExisting[i] = { url: null, index: i };
                      setExistingImages(newExisting);
                    }
                  }} />
                  {imageFiles[i] ? t('admin.change') : existingImages[i]?.url ? t('admin.replace') : t('admin.upload')}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

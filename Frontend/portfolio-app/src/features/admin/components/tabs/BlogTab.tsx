import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createBlogPost, updateBlogPost, deleteBlogPost, fetchAllBlogComments, approveBlogComment, deleteBlogComment } from '../../../../api/api';
import { uploadImage } from '../../../../api/client';
import type { AppData, BlogPost, BlogComment } from '../../../../types';
import { getErrorMessage } from '../helpers';

export default function BlogTab({ data, onDataUpdate }: { data: AppData; onDataUpdate: () => Promise<void> }) {
  const { t } = useTranslation();
  const [items, setItems] = useState<BlogPost[]>(data.blogPosts || []);
  const [form, setForm] = useState({ title: '', titleAr: '', slug: '', excerpt: '', excerptAr: '', content: '', contentAr: '', coverImageUrl: '', author: '', tags: '', published: true });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setItems(data.blogPosts || []); }, [data.blogPosts]);

  const loadComments = async () => {
    try { setComments(await fetchAllBlogComments()); } catch { }
  };

  useEffect(() => { if (showComments) loadComments(); }, [showComments]);

  const handleAdd = async () => {
    if (!form.title || !form.slug) return;
    try {
      const payload: any = { ...form };
      if (coverImageFile) {
        payload.coverImageUrl = await uploadImage(coverImageFile);
      }
      if (editingId) { await updateBlogPost(editingId, payload); setItems(items.map(i => i.id === editingId ? { ...i, ...payload } : i)); setEditingId(null); }
      else { const newItem = await createBlogPost(payload); setItems([...items, newItem]); }
      setForm({ title: '', titleAr: '', slug: '', excerpt: '', excerptAr: '', content: '', contentAr: '', coverImageUrl: '', author: '', tags: '', published: true });
      setCoverImageFile(null);
      setCoverPreview(null);
      toast.success(t('admin.blogPostSaved'));
    } catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteBlogPost(id); setItems(items.filter(i => i.id !== id)); toast.success(t('admin.deleted')); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleApproveComment = async (id: number) => {
    try { await approveBlogComment(id); toast.success(t('admin.reviewApproved')); await loadComments(); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const handleDeleteComment = async (id: number) => {
    try { await deleteBlogComment(id); toast.success(t('admin.deleted')); await loadComments(); }
    catch (err: any) { toast.error(getErrorMessage(err, t('admin.failed'))); }
  };

  const pendingCount = comments.filter(c => !c.isApproved).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => { setShowComments(!showComments); if (!showComments) loadComments(); }}
        >
          {t('comments.title')} ({pendingCount} {t('comments.pending').toLowerCase()})
        </button>
      </div>

      {showComments && (
        <div style={{ marginBottom: '1.5rem' }}>
          {comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('comments.noComments')}</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div className="list-item-info">
                    <h4>{comment.authorName} {!comment.isApproved && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>({t('comments.pending')})</span>}</h4>
                    <p>{comment.authorEmail} - {new Date(comment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="list-item-actions">
                    {!comment.isApproved && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleApproveComment(comment.id)}>{t('admin.yes')}</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>{t('admin.delete')}</button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="list-item">
          <div className="list-item-info">
            <h4>{item.title}</h4>
            <p>{item.published ? t('admin.statusPublished') : t('admin.statusDraft')} - {item.slug}</p>
          </div>
          <div className="list-item-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => { setForm({ title: item.title, titleAr: item.titleAr || '', slug: item.slug, excerpt: item.excerpt || '', excerptAr: item.excerptAr || '', content: item.content, contentAr: item.contentAr || '', coverImageUrl: item.coverImageUrl || '', author: item.author || '', tags: item.tags || '', published: item.published }); setCoverImageFile(null); setCoverPreview(null); setEditingId(item.id); }}>{t('admin.edit')}</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>{t('admin.delete')}</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{editingId ? t('admin.edit') : t('admin.add')}</h4>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.title')}</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.slug')}</label><input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.excerpt')}</label><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.excerpt')} ({t('admin.arSuffix')})</label><textarea value={form.excerptAr} onChange={(e) => setForm({ ...form, excerptAr: e.target.value })} /></div>
        </div>
        <div className="form-group"><label>{t('admin.content')}</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ minHeight: '120px' }} /></div>
        <div className="form-group"><label>{t('admin.content')} ({t('admin.arSuffix')})</label><textarea value={form.contentAr} onChange={(e) => setForm({ ...form, contentAr: e.target.value })} style={{ minHeight: '120px' }} /></div>
        <div className="form-row">
          <div className="form-group">
            <label>{t('admin.coverImage')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              {(coverPreview || form.coverImageUrl) && (
                <img src={coverPreview || form.coverImageUrl} alt="Cover" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
              )}
              <label className="file-upload-area" style={{ flex: 1 }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (coverPreview) URL.revokeObjectURL(coverPreview);
                  if (file) {
                    setCoverImageFile(file);
                    setCoverPreview(URL.createObjectURL(file));
                  } else {
                    setCoverImageFile(null);
                    setCoverPreview(null);
                  }
                }} />
                <p>{coverImageFile ? coverImageFile.name : t('admin.uploadPhoto')}</p>
              </label>
            </div>
            <input type="url" placeholder="Or paste image URL" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
          </div>
          <div className="form-group"><label>{t('admin.author')}</label><input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>{t('admin.tags')}</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <div className="form-group"><label>{t('admin.published')}</label><select value={String(form.published)} onChange={(e) => setForm({ ...form, published: e.target.value === 'true' })}><option value="true">{t('admin.yes')}</option><option value="false">{t('admin.no')}</option></select></div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>{editingId ? t('admin.update') : t('admin.add')}</button>
      </div>
    </div>
  );
}

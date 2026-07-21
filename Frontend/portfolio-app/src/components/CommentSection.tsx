import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchBlogComments, addBlogComment } from '../api/api';
import type { BlogComment } from '../types';

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogComments(postId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName || !form.authorEmail || !form.content) return;
    setSubmitting(true);
    try {
      await addBlogComment(postId, form);
      setForm({ authorName: '', authorEmail: '', content: '' });
      toast.success(t('comments.pending'));
    } catch {
      toast.error(t('contact.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        {t('comments.title')} ({comments.length})
      </h3>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>{t('comments.name')}</label>
            <input
              type="text"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('comments.email')}</label>
            <input
              type="email"
              value={form.authorEmail}
              onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>{t('comments.content')}</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            style={{ minHeight: '80px' }}
          />
        </div>
        <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
          {submitting ? t('contact.sending') : t('comments.submit')}
        </button>
      </form>

      <div className="comments-list">
        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('loading')}</p>
        ) : comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('comments.noComments')}</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.authorName}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

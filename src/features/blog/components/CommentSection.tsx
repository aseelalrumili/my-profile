import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchBlogComments, addBlogComment } from '../../../api/api';
import type { BlogComment } from '../../../types';

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogComments(postId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName || !form.authorEmail || !form.content) return;
    setIsSubmitting(true);
    try {
      await addBlogComment({ blogPostId: postId, ...form });
      setForm({ authorName: '', authorEmail: '', content: '' });
      toast.success(t('comments.pending'));
    } catch {
      toast.error(t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        {t('comments.title')} ({comments.length})
      </h3>

      <form className="comment-form" onSubmit={handleSubmit} aria-label={t('comments.leaveComment')}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="comment-name">{t('comments.name')}</label>
            <input
              id="comment-name"
              type="text"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comment-email">{t('comments.email')}</label>
            <input
              id="comment-email"
              type="email"
              value={form.authorEmail}
              onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="comment-content">{t('comments.content')}</label>
          <textarea
            id="comment-content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            style={{ minHeight: '80px' }}
          />
        </div>
        <button className="btn btn-primary btn-sm" type="submit" disabled={isSubmitting}>
          {isSubmitting ? t('contact.sending') : t('comments.submit')}
        </button>
      </form>

      <div className="comments-list">
        {isLoading ? (
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

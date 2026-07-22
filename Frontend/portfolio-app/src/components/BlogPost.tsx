import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchBlogPost } from '../api/api';
import { getUploadUrl, getCachedImage } from '../api/client';
import type { BlogPost as BlogPostType } from '../types';
import ShareButtons from './ShareButtons';
import CommentSection from './CommentSection';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug).then(setPost).catch(() => setNotFound(true));
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>404</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('blog.noPosts')}</p>
        <Link to="/blog" className="btn btn-primary">{t('blog.backToBlog')}</Link>
      </div>
    );
  }

  if (!post) return <div className="section"><p style={{ color: 'var(--text-secondary)' }}>{t('loading')}</p></div>;

  return (
    <main className="section">
      <Link to="/blog" className="blog-back-btn">&larr; {t('blog.backToBlog')}</Link>

      <motion.article
        className="blog-post"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {post.coverImageUrl && (
          <img className="blog-post-cover" src={getCachedImage(getUploadUrl(post.coverImageUrl)) || getUploadUrl(post.coverImageUrl)} alt={isAr && post.titleAr ? post.titleAr : post.title} loading="lazy" />
        )}

        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
          {isAr && post.titleAr ? post.titleAr : post.title}
        </h1>

        <div className="blog-post-meta">
          {post.author && <span>{post.author}</span>}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.tags && <span>{post.tags}</span>}
        </div>

        <div className="blog-post-content">
          {(isAr && post.contentAr ? post.contentAr : post.content).split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <ShareButtons url={window.location.href} title={isAr && post.titleAr ? post.titleAr : post.title} />
        </div>
      </motion.article>

      <CommentSection postId={post.id} />
    </main>
  );
}

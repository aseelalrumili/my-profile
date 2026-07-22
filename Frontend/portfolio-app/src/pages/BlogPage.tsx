import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchBlogPosts } from '../api/api';
import type { BlogPost as BlogPostType } from '../types';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogPosts()
      .then((data) => setPosts(data.filter((p) => p.published)))
      .catch(() => setError(t('blog.loadError') || 'Failed to load blog posts.'))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <main className="section">
      <Link to="/" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Home
      </Link>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('blogPage.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('blogPage.subtitle')}
      </motion.p>

      {loading ? (
        <div className="blog-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="blog-card" style={{ pointerEvents: 'none' }}>
              <div className="blog-card-image" style={{ background: 'var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div className="blog-card-body">
                <div style={{ height: '1.2rem', width: '70%', background: 'var(--border)', borderRadius: '4px', marginBottom: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: '0.85rem', width: '100%', background: 'var(--border)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: '0.85rem', width: '60%', background: 'var(--border)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>{error}</p>
      ) : posts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>{t('blog.noPosts')}</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="blog-card">
                  {post.coverImageUrl && (
                    <img className="blog-card-image" src={post.coverImageUrl} alt={isAr && post.titleAr ? post.titleAr : post.title} />
                  )}
                  <div className="blog-card-body">
                    <h3>{isAr && post.titleAr ? post.titleAr : post.title}</h3>
                    <p className="blog-excerpt">{isAr && post.excerptAr ? post.excerptAr : post.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="blog-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="blog-read-more">{t('blog.readMore')} &rarr;</span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

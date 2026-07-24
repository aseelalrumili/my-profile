import type { BlogPost, BlogComment } from '../types';
import * as store from '../core/store';

export const fetchBlogPosts = async (): Promise<BlogPost[]> => store.getAll<BlogPost>('blogPosts');

export const fetchBlogPost = async (slug: string): Promise<BlogPost> => {
  const posts = store.getAll<BlogPost>('blogPosts');
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error('Not found');
  return post;
};

export const createBlogPost = async (data: Partial<BlogPost>): Promise<BlogPost> => {
  const now = new Date().toISOString();
  return store.add<BlogPost>('blogPosts', {
    title: data.title || '',
    titleAr: data.titleAr,
    slug: data.slug || '',
    excerpt: data.excerpt,
    excerptAr: data.excerptAr,
    content: data.content || '',
    contentAr: data.contentAr,
    coverImageUrl: data.coverImageUrl,
    author: data.author,
    tags: data.tags,
    published: data.published ?? false,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateBlogPost = async (id: number, data: Partial<BlogPost>): Promise<BlogPost> => {
  return store.update<BlogPost>('blogPosts', id, { ...data, updatedAt: new Date().toISOString() });
};

export const deleteBlogPost = async (id: number) => {
  store.remove<BlogPost>('blogPosts', id);
};

export const fetchBlogComments = async (postId: number): Promise<BlogComment[]> => {
  return store.getAll<BlogComment>('blogComments').filter((c) => c.blogPostId === postId && c.isApproved);
};

export const fetchAllBlogComments = async (): Promise<BlogComment[]> => store.getAll<BlogComment>('blogComments');

export const addBlogComment = async (data: Omit<BlogComment, 'id' | 'isApproved' | 'createdAt'>): Promise<BlogComment> => {
  return store.add<BlogComment>('blogComments', {
    ...data,
    isApproved: false,
    createdAt: new Date().toISOString(),
  });
};

export const approveBlogComment = async (id: number) => {
  return store.update<BlogComment>('blogComments', id, { isApproved: true });
};

export const deleteBlogComment = async (id: number) => {
  store.remove<BlogComment>('blogComments', id);
};

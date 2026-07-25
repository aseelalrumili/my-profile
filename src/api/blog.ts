import type { BlogPost, BlogComment } from '../types';
import { getCollection, addItem, updateItem, removeItem, fetchAllData, updateData } from '../core/store';

export const fetchBlogPosts = (): Promise<BlogPost[]> => getCollection<BlogPost>('blogPosts');

export const fetchBlogPost = async (slug: string): Promise<BlogPost> => {
  const posts = await getCollection<BlogPost>('blogPosts');
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error('Not found');
  return post;
};

export const createBlogPost = async (data: Partial<BlogPost>): Promise<BlogPost> => {
  const now = new Date().toISOString();
  return addItem<BlogPost>('blogPosts', {
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

export const updateBlogPost = (id: number, data: Partial<BlogPost>) =>
  updateItem<BlogPost>('blogPosts', id, { ...data, updatedAt: new Date().toISOString() });

export const deleteBlogPost = (id: number) => removeItem<BlogPost>('blogPosts', id);

export const fetchBlogComments = async (postId: number): Promise<BlogComment[]> => {
  const all = await getCollection<BlogComment>('blogComments');
  return all.filter((c) => c.blogPostId === postId && c.isApproved);
};

export const fetchAllBlogComments = (): Promise<BlogComment[]> => getCollection<BlogComment>('blogComments');

export const addBlogComment = async (data: Omit<BlogComment, 'id' | 'isApproved' | 'createdAt'>): Promise<BlogComment> => {
  return addItem<BlogComment>('blogComments', {
    ...data,
    isApproved: false,
    createdAt: new Date().toISOString(),
  });
};

export const approveBlogComment = (id: number) => updateItem<BlogComment>('blogComments', id, { isApproved: true });
export const deleteBlogComment = (id: number) => removeItem<BlogComment>('blogComments', id);

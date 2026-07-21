import type { BlogPost, BlogComment } from '../types';
import { API } from './client';

export const fetchBlogPosts = async (): Promise<BlogPost[]> => (await API.get('/blog')).data;
export const fetchBlogPost = async (slug: string): Promise<BlogPost> => (await API.get(`/blog/${slug}`)).data;
export const createBlogPost = async (post: Partial<BlogPost>): Promise<BlogPost> => (await API.post('/blog', post)).data;
export const updateBlogPost = async (id: number, post: Partial<BlogPost>): Promise<BlogPost> => (await API.put(`/blog/${id}`, post)).data;
export const deleteBlogPost = async (id: number): Promise<void> => { await API.delete(`/blog/${id}`); };

export const fetchBlogComments = async (postId: number): Promise<BlogComment[]> => (await API.get(`/blog/${postId}/comments`)).data;
export const fetchAllBlogComments = async (): Promise<BlogComment[]> => (await API.get('/blog/comments/all')).data;
export const addBlogComment = async (postId: number, comment: Partial<BlogComment>): Promise<BlogComment> => (await API.post(`/blog/${postId}/comments`, comment)).data;
export const approveBlogComment = async (commentId: number): Promise<BlogComment> => (await API.put(`/blog/comments/${commentId}/approve`)).data;
export const deleteBlogComment = async (commentId: number): Promise<void> => { await API.delete(`/blog/comments/${commentId}`); };

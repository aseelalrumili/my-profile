import type { Review } from '../types';
import { API } from './client';

export const fetchReviews = async (): Promise<Review[]> => (await API.get('/reviews')).data;
export const fetchAllReviews = async (): Promise<Review[]> => (await API.get('/reviews/all')).data;

export const addReview = async (r: { name: string; rating: number; comment: string; avatarUrl?: string }): Promise<Review> =>
  (await API.post('/reviews', { name: r.name, rating: r.rating, comment: r.comment, avatarUrl: r.avatarUrl })).data;

export const updateReview = async (id: number, r: Partial<Review>): Promise<Review> => (await API.put(`/reviews/${id}`, r)).data;
export const deleteReview = async (id: number): Promise<void> => { await API.delete(`/reviews/${id}`); };
export const approveReview = async (id: number): Promise<Review> => (await API.put(`/reviews/${id}/approve`)).data;
export const fetchReviewStats = async (): Promise<{ total: number; average: number }> => (await API.get('/reviews/stats')).data;

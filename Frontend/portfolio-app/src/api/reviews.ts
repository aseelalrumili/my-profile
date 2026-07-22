import type { Review } from '../types';
import { API } from './client';

export const fetchReviews = async (): Promise<Review[]> => (await API.get('/reviews')).data;
export const fetchAllReviews = async (): Promise<Review[]> => (await API.get('/reviews/all')).data;

export const addReview = async (r: { name: string; rating: number; comment: string; avatarFile?: File }): Promise<Review> => {
  if (r.avatarFile) {
    const fd = new FormData();
    fd.append('name', r.name);
    fd.append('rating', String(r.rating));
    fd.append('comment', r.comment);
    fd.append('avatar', r.avatarFile);
    return (await API.post('/reviews', fd)).data;
  }
  return (await API.post('/reviews', { name: r.name, rating: r.rating, comment: r.comment })).data;
};

export const updateReview = async (id: number, r: Partial<Review>): Promise<Review> => (await API.put(`/reviews/${id}`, r)).data;
export const deleteReview = async (id: number): Promise<void> => { await API.delete(`/reviews/${id}`); };
export const approveReview = async (id: number): Promise<Review> => (await API.put(`/reviews/${id}/approve`)).data;
export const fetchReviewStats = async (): Promise<{ total: number; average: number }> => (await API.get('/reviews/stats')).data;

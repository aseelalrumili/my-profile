import type { Review } from '../types';
import { getCollection, updateItem, removeItem } from '../core/store';
import axios from 'axios';

export const fetchReviews = async (): Promise<Review[]> => {
  const all = await getCollection<Review>('reviews');
  return all.filter((r) => r.isApproved);
};

export const fetchAllReviews = (): Promise<Review[]> => getCollection<Review>('reviews');

export const addReview = async (data: Omit<Review, 'id' | 'isApproved' | 'createdAt'>): Promise<Review> => {
  const { data: result } = await axios.post('/api/reviews', data);
  return result.review;
};

export const updateReview = (id: number, data: Partial<Review>) => updateItem<Review>('reviews', id, data);
export const deleteReview = (id: number) => removeItem<Review>('reviews', id);
export const approveReview = (id: number) => updateItem<Review>('reviews', id, { isApproved: true });

export const fetchReviewStats = async (): Promise<{ total: number; average: number }> => {
  const approved = await fetchReviews();
  const total = approved.length;
  const average = total ? approved.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  return { total, average };
};

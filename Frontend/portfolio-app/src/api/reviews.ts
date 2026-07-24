import type { Review } from '../types';
import * as store from '../core/store';

export const fetchReviews = async (): Promise<Review[]> => {
  return store.getAll<Review>('reviews').filter((r) => r.isApproved);
};

export const fetchAllReviews = async (): Promise<Review[]> => store.getAll<Review>('reviews');

export const addReview = async (data: Omit<Review, 'id' | 'isApproved' | 'createdAt'>): Promise<Review> => {
  return store.add<Review>('reviews', {
    ...data,
    isApproved: false,
    createdAt: new Date().toISOString(),
  });
};

export const updateReview = async (id: number, data: Partial<Review>): Promise<Review> => {
  return store.update<Review>('reviews', id, data);
};

export const deleteReview = async (id: number) => {
  store.remove<Review>('reviews', id);
};

export const approveReview = async (id: number) => {
  return store.update<Review>('reviews', id, { isApproved: true });
};

export const fetchReviewStats = async (): Promise<{ total: number; average: number }> => {
  const approved = await fetchReviews();
  const total = approved.length;
  const average = total ? approved.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  return { total, average };
};

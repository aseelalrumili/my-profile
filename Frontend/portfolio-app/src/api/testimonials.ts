import type { Testimonial } from '../types';
import * as store from '../core/store';

export const fetchTestimonials = async (): Promise<Testimonial[]> => store.getAll<Testimonial>('testimonials');

export const addTestimonial = async (data: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
  return store.add<Testimonial>('testimonials', data);
};

export const updateTestimonial = async (id: number, data: Partial<Testimonial>): Promise<Testimonial> => {
  return store.update<Testimonial>('testimonials', id, data);
};

export const deleteTestimonial = async (id: number) => {
  store.remove<Testimonial>('testimonials', id);
};

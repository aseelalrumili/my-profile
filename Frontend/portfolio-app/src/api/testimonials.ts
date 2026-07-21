import type { Testimonial } from '../types';
import { API } from './client';

export const fetchTestimonials = async (): Promise<Testimonial[]> => (await API.get('/testimonials')).data;
export const addTestimonial = async (t: Partial<Testimonial>): Promise<Testimonial> => (await API.post('/testimonials', t)).data;
export const updateTestimonial = async (id: number, t: Partial<Testimonial>): Promise<Testimonial> => (await API.put(`/testimonials/${id}`, t)).data;
export const deleteTestimonial = async (id: number): Promise<void> => { await API.delete(`/testimonials/${id}`); };

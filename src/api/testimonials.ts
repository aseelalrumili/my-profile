import type { Testimonial } from '../types';
import { getCollection, addItem, updateItem, removeItem } from '../core/store';

export const fetchTestimonials = (): Promise<Testimonial[]> => getCollection<Testimonial>('testimonials');
export const addTestimonial = (data: Omit<Testimonial, 'id'>) => addItem<Testimonial>('testimonials', data);
export const updateTestimonial = (id: number, data: Partial<Testimonial>) => updateItem<Testimonial>('testimonials', id, data);
export const deleteTestimonial = (id: number) => removeItem<Testimonial>('testimonials', id);

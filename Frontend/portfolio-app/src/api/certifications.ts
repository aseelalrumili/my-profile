import type { Certification } from '../types';
import { getCollection, addItem, updateItem, removeItem } from '../core/store';

export const fetchCertifications = (): Promise<Certification[]> => getCollection<Certification>('certifications');
export const addCertification = (data: Omit<Certification, 'id'>) => addItem<Certification>('certifications', data);
export const updateCertification = (id: number, data: Partial<Certification>) => updateItem<Certification>('certifications', id, data);
export const deleteCertification = (id: number) => removeItem<Certification>('certifications', id);

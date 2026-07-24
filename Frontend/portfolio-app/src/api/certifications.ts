import type { Certification } from '../types';
import * as store from '../core/store';

export const fetchCertifications = async (): Promise<Certification[]> => store.getAll<Certification>('certifications');

export const addCertification = async (data: Omit<Certification, 'id'>): Promise<Certification> => {
  return store.add<Certification>('certifications', data);
};

export const updateCertification = async (id: number, data: Partial<Certification>): Promise<Certification> => {
  return store.update<Certification>('certifications', id, data);
};

export const deleteCertification = async (id: number) => {
  store.remove<Certification>('certifications', id);
};

import type { Certification } from '../types';
import { API } from './client';

export const fetchCertifications = async (): Promise<any[]> => (await API.get('/certifications')).data;
export const addCertification = async (formData: FormData): Promise<any> => (await API.post('/certifications', formData)).data;
export const updateCertification = async (id: number, formData: FormData): Promise<any> => (await API.put(`/certifications/${id}`, formData)).data;
export const deleteCertification = async (id: number): Promise<void> => { await API.delete(`/certifications/${id}`); };

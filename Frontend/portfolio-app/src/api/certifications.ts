import type { Certification } from '../types';
import { API } from './client';

export const fetchCertifications = async (): Promise<any[]> => (await API.get('/certifications')).data;
export const addCertification = async (payload: any): Promise<any> => (await API.post('/certifications', payload)).data;
export const updateCertification = async (id: number, payload: any): Promise<any> => (await API.put(`/certifications/${id}`, payload)).data;
export const deleteCertification = async (id: number): Promise<void> => { await API.delete(`/certifications/${id}`); };

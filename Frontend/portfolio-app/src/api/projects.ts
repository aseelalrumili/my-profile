import type { Project } from '../types';
import { API } from './client';

export const fetchProjects = async (): Promise<Project[]> => (await API.get('/projects')).data;
export const createProject = async (payload: any): Promise<Project> => (await API.post('/projects', payload)).data;
export const updateProject = async (id: number, payload: any): Promise<Project> => (await API.put(`/projects/${id}`, payload)).data;
export const deleteProject = async (id: number): Promise<void> => { await API.delete(`/projects/${id}`); };
export const deleteMedia = async (mediaId: number): Promise<void> => { await API.delete(`/projects/media/${mediaId}`); };

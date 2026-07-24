import type { Project, MediaItem } from '../types';
import * as store from '../core/store';

export const fetchProjects = async (): Promise<Project[]> => store.getAll<Project>('projects');

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  return store.add<Project>('projects', {
    title: data.title || '',
    titleAr: data.titleAr,
    description: data.description,
    descriptionAr: data.descriptionAr,
    type: data.type || 'Design',
    category: data.category,
    techStack: data.techStack,
    liveUrl: data.liveUrl,
    sortOrder: data.sortOrder || 0,
    media: data.media || [],
    problem: data.problem,
    problemAr: data.problemAr,
    solution: data.solution,
    solutionAr: data.solutionAr,
    role: data.role,
    roleAr: data.roleAr,
    impact: data.impact,
    impactAr: data.impactAr,
  });
};

export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  return store.update<Project>('projects', id, data);
};

export const deleteProject = async (id: number) => {
  store.remove<Project>('projects', id);
};

export const deleteMedia = async (id: number) => {
  const projects = store.getAll<Project>('projects');
  for (const p of projects) {
    const filtered = p.media.filter((m) => m.id !== id);
    if (filtered.length !== p.media.length) {
      store.update<Project>('projects', p.id, { media: filtered });
      return;
    }
  }
};

import type { Project } from '../types';
import { getCollection, addItem, updateItem, removeItem, fetchAllData } from '../core/store';

export const fetchProjects = (): Promise<Project[]> => getCollection<Project>('projects');

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  return addItem<Project>('projects', {
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

export const updateProject = (id: number, data: Partial<Project>) => updateItem<Project>('projects', id, data);
export const deleteProject = (id: number) => removeItem<Project>('projects', id);

export const deleteMedia = async (id: number) => {
  const data = await fetchAllData();
  if (!data) return;
  for (const p of data.projects) {
    const filtered = p.media.filter((m) => m.id !== id);
    if (filtered.length !== p.media.length) {
      await updateItem<Project>('projects', p.id, { media: filtered });
      return;
    }
  }
};

import type { AppData, Profile, SocialLink, Skill, Experience, Education } from '../types';
import { fallbackData } from '../fallbackData';
import { fetchAllData, updateData, getCollection, addItem, updateItem, removeItem, getObject, updateObject } from '../core/store';

export const fetchAll = async (): Promise<AppData> => {
  const data = await fetchAllData();
  return data || fallbackData;
};

export const updateProfile = async (data: Partial<Profile>) => {
  await updateObject('profile', data);
  return (await getObject('profile')) as Profile;
};

export const fetchSocialLinks = () => getCollection<SocialLink>('socialLinks');
export const addSocialLink = (item: Omit<SocialLink, 'id'>) => addItem<SocialLink>('socialLinks', item);
export const updateSocialLink = (id: number, data: Partial<SocialLink>) => updateItem<SocialLink>('socialLinks', id, data);
export const deleteSocialLink = (id: number) => removeItem<SocialLink>('socialLinks', id);

export const fetchSkills = () => getCollection<Skill>('skills');
export const addSkill = (item: Omit<Skill, 'id'>) => addItem<Skill>('skills', item);
export const updateSkill = (id: number, data: Partial<Skill>) => updateItem<Skill>('skills', id, data);
export const deleteSkill = (id: number) => removeItem<Skill>('skills', id);

export const fetchExperience = () => getCollection<Experience>('experience');
export const addExperience = (item: Omit<Experience, 'id'>) => addItem<Experience>('experience', item);
export const updateExperience = (id: number, data: Partial<Experience>) => updateItem<Experience>('experience', id, data);
export const deleteExperience = (id: number) => removeItem<Experience>('experience', id);

export const fetchEducation = () => getCollection<Education>('education');
export const addEducation = (item: Omit<Education, 'id'>) => addItem<Education>('education', item);
export const updateEducation = (id: number, data: Partial<Education>) => updateItem<Education>('education', id, data);
export const deleteEducation = (id: number) => removeItem<Education>('education', id);

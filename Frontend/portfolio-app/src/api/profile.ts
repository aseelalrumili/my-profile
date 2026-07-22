import type {
  AppData, Profile, SocialLink,
  Skill, Experience, Education,
} from '../types';
import { API } from './client';

export const fetchAll = async (): Promise<AppData> => {
  const { data } = await API.get('/profile/all');
  return data;
};

export const updateProfile = async (payload: Record<string, any>): Promise<Profile> => {
  const { data } = await API.put('/profile', payload);
  return data;
};

export const fetchSocialLinks = async (): Promise<SocialLink[]> => (await API.get('/profile/social')).data;
export const addSocialLink = async (link: Partial<SocialLink>): Promise<SocialLink> => (await API.post('/profile/social', link)).data;
export const updateSocialLink = async (id: number, link: Partial<SocialLink>): Promise<SocialLink> => (await API.put(`/profile/social/${id}`, link)).data;
export const deleteSocialLink = async (id: number): Promise<void> => { await API.delete(`/profile/social/${id}`); };

export const fetchSkills = async (): Promise<Skill[]> => (await API.get('/profile/skills')).data;
export const addSkill = async (skill: Partial<Skill>): Promise<Skill> => (await API.post('/profile/skills', skill)).data;
export const updateSkill = async (id: number, skill: Partial<Skill>): Promise<Skill> => (await API.put(`/profile/skills/${id}`, skill)).data;
export const deleteSkill = async (id: number): Promise<void> => { await API.delete(`/profile/skills/${id}`); };

export const fetchExperience = async (): Promise<Experience[]> => (await API.get('/profile/experience')).data;
export const addExperience = async (exp: Partial<Experience>): Promise<Experience> => (await API.post('/profile/experience', exp)).data;
export const updateExperience = async (id: number, exp: Partial<Experience>): Promise<Experience> => (await API.put(`/profile/experience/${id}`, exp)).data;
export const deleteExperience = async (id: number): Promise<void> => { await API.delete(`/profile/experience/${id}`); };

export const fetchEducation = async (): Promise<Education[]> => (await API.get('/profile/education')).data;
export const addEducation = async (edu: Partial<Education>): Promise<Education> => (await API.post('/profile/education', edu)).data;
export const updateEducation = async (id: number, edu: Partial<Education>): Promise<Education> => (await API.put(`/profile/education/${id}`, edu)).data;
export const deleteEducation = async (id: number): Promise<void> => { await API.delete(`/profile/education/${id}`); };

import type { AppData, Profile, SocialLink, Skill, Experience, Education } from '../types';
import { fallbackData } from '../fallbackData';
import * as store from '../core/store';

export const fetchAll = async (): Promise<AppData> => {
  store.initData();
  return {
    profile: store.getProfile(),
    socialLinks: store.getAll<SocialLink>('socialLinks'),
    skills: store.getAll<Skill>('skills'),
    experience: store.getAll<Experience>('experience'),
    education: store.getAll<Education>('education'),
    projects: store.getAll('projects'),
    certifications: store.getAll('certifications'),
    blogPosts: store.getAll('blogPosts'),
    testimonials: store.getAll('testimonials'),
    reviews: store.getAll('reviews'),
    settings: store.getSettings(),
  };
};

export const updateProfile = async (data: Partial<Profile>) => store.updateProfile(data);

export const fetchSocialLinks = async () => store.getAll<SocialLink>('socialLinks');
export const addSocialLink = async (item: Omit<SocialLink, 'id'>) => store.add<SocialLink>('socialLinks', item);
export const updateSocialLink = async (id: number, data: Partial<SocialLink>) => store.update<SocialLink>('socialLinks', id, data);
export const deleteSocialLink = async (id: number) => store.remove<SocialLink>('socialLinks', id);

export const fetchSkills = async () => store.getAll<Skill>('skills');
export const addSkill = async (item: Omit<Skill, 'id'>) => store.add<Skill>('skills', item);
export const updateSkill = async (id: number, data: Partial<Skill>) => store.update<Skill>('skills', id, data);
export const deleteSkill = async (id: number) => store.remove<Skill>('skills', id);

export const fetchExperience = async () => store.getAll<Experience>('experience');
export const addExperience = async (item: Omit<Experience, 'id'>) => store.add<Experience>('experience', item);
export const updateExperience = async (id: number, data: Partial<Experience>) => store.update<Experience>('experience', id, data);
export const deleteExperience = async (id: number) => store.remove<Experience>('experience', id);

export const fetchEducation = async () => store.getAll<Education>('education');
export const addEducation = async (item: Omit<Education, 'id'>) => store.add<Education>('education', item);
export const updateEducation = async (id: number, data: Partial<Education>) => store.update<Education>('education', id, data);
export const deleteEducation = async (id: number) => store.remove<Education>('education', id);

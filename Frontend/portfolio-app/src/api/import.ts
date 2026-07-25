import * as store from '../core/store';
import type { AppData } from '../types';

export const importData = async (payload: Partial<AppData>): Promise<void> => {
  if (payload.profile) store.updateProfile(payload.profile);
  const arrayKeys = [
    'socialLinks', 'skills', 'experience', 'education',
    'projects', 'certifications', 'blogPosts',
    'testimonials', 'reviews',
  ] as const;
  for (const key of arrayKeys) {
    if (payload[key]) {
      localStorage.setItem(`portfolio_${key}`, JSON.stringify(payload[key]));
    }
  }
  if (payload.settings) {
    localStorage.setItem('portfolio_settings', JSON.stringify(payload.settings));
  }
};

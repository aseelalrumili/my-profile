import { fallbackData } from '../fallbackData';

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(`portfolio_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function save<T>(key: string, items: T[]) {
  localStorage.setItem(`portfolio_${key}`, JSON.stringify(items));
}

function loadObj<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`portfolio_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveObj<T>(key: string, obj: T) {
  localStorage.setItem(`portfolio_${key}`, JSON.stringify(obj));
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

function initIfEmpty(key: string, fallback: unknown[]) {
  if (!localStorage.getItem(`portfolio_${key}`) && fallback.length) {
    save(key, fallback);
  }
}

export function initData() {
  initIfEmpty('socialLinks', fallbackData.socialLinks);
  initIfEmpty('skills', fallbackData.skills);
  initIfEmpty('experience', fallbackData.experience);
  initIfEmpty('education', fallbackData.education);
  initIfEmpty('projects', fallbackData.projects);
  initIfEmpty('certifications', fallbackData.certifications);
  initIfEmpty('blogPosts', fallbackData.blogPosts);
  initIfEmpty('testimonials', fallbackData.testimonials);
  initIfEmpty('reviews', fallbackData.reviews);
  initIfEmpty('messages', []);
  initIfEmpty('blogComments', []);
  if (!localStorage.getItem('portfolio_profile')) {
    saveObj('profile', fallbackData.profile);
  }
  if (!localStorage.getItem('portfolio_settings')) {
    saveObj('settings', fallbackData.settings);
  }
}

export function getProfile() {
  return loadObj<import('./types').Profile>('profile') || fallbackData.profile;
}

export function updateProfile(data: Partial<import('./types').Profile>) {
  const current = getProfile();
  const updated = { ...current, ...data };
  saveObj('profile', updated);
  return updated;
}

export function getAll<T extends { id: number }>(key: string): T[] {
  return load<T>(key);
}

export function add<T extends { id: number }>(key: string, item: Omit<T, 'id'>): T {
  const items = load<T>(key);
  const newItem = { ...item, id: nextId(items) } as T;
  items.push(newItem);
  save(key, items);
  return newItem;
}

export function update<T extends { id: number }>(key: string, id: number, data: Partial<T>): T {
  const items = load<T>(key);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Not found');
  items[idx] = { ...items[idx], ...data };
  save(key, items);
  return items[idx];
}

export function remove<T extends { id: number }>(key: string, id: number) {
  const items = load<T>(key);
  save(key, items.filter((i) => i.id !== id));
}

export function getSettings(): Record<string, string> {
  return loadObj<Record<string, string>>('settings') || {};
}

export function updateSettings(data: Record<string, string>) {
  saveObj('settings', { ...getSettings(), ...data });
}

import axios from 'axios';
import type { AppData } from '../types';
import { fallbackData } from '../fallbackData';
import { safeStorage } from '@/shared/utils/safeStorage';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = safeStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let pendingWrite: Promise<void> = Promise.resolve();

function enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
  const chained = pendingWrite.then(() => fn(), () => fn());
  pendingWrite = chained.then(() => {}, () => {});
  return chained;
}

export async function fetchAllData(): Promise<AppData | null> {
  try {
    const { data } = await API.get('/data');
    if (data && data.profile) {
      return {
        ...fallbackData,
        ...data,
        profile: { ...fallbackData.profile, ...data.profile },
        socialLinks: data.socialLinks ?? fallbackData.socialLinks,
        skills: data.skills ?? fallbackData.skills,
        experience: data.experience ?? fallbackData.experience,
        education: data.education ?? fallbackData.education,
        projects: data.projects ?? fallbackData.projects,
        certifications: data.certifications ?? fallbackData.certifications,
        blogPosts: data.blogPosts ?? fallbackData.blogPosts,
        testimonials: data.testimonials ?? fallbackData.testimonials,
        reviews: data.reviews ?? fallbackData.reviews,
        settings: data.settings ?? fallbackData.settings,
        resumeVersions: data.resumeVersions ?? fallbackData.resumeVersions,
      } as AppData;
    }
  } catch {}
  return null;
}

export async function updateData(patch: Record<string, unknown>): Promise<void> {
  await API.put('/data', patch);
}

export async function getCollection<T extends { id: number }>(key: string): Promise<T[]> {
  const data = await fetchAllData();
  return (data?.[key as keyof AppData] as unknown as T[]) || [];
}

export async function addItem<T extends { id: number }>(key: string, item: Omit<T, 'id'>): Promise<T> {
  return enqueueWrite(async () => {
    const data = await fetchAllData();
    const items = (data?.[key as keyof AppData] as unknown as T[]) || [];
    const maxId = items.length ? Math.max(...items.map((i) => i.id)) : 0;
    const newItem = { ...item, id: maxId + 1 } as T;
    items.push(newItem);
    await updateData({ [key]: items });
    return newItem;
  });
}

export async function updateItem<T extends { id: number }>(key: string, id: number, patch: Partial<T>): Promise<T> {
  return enqueueWrite(async () => {
    const data = await fetchAllData();
    const items = (data?.[key as keyof AppData] as unknown as T[]) || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Not found');
    items[index] = { ...items[index], ...patch };
    await updateData({ [key]: items });
    return items[index];
  });
}

export async function removeItem<T extends { id: number }>(key: string, id: number): Promise<void> {
  return enqueueWrite(async () => {
    const data = await fetchAllData();
    const items = (data?.[key as keyof AppData] as unknown as T[]) || [];
    await updateData({ [key]: items.filter((i) => i.id !== id) });
  });
}

export async function getObject<K extends keyof AppData>(key: K): Promise<AppData[K]> {
  const data = await fetchAllData();
  if (data && key in data) return data[key];
  return fallbackData[key];
}

export async function updateObject<K extends keyof AppData>(key: K, patch: Partial<AppData[K]>): Promise<void> {
  return enqueueWrite(async () => {
    const current = await fetchAllData();
    const currentVal = current?.[key] ?? fallbackData[key];
    const updated = typeof currentVal === 'object' && !Array.isArray(currentVal)
      ? { ...currentVal, ...patch }
      : patch;
    await updateData({ [key]: updated });
  });
}

export async function getSettings(): Promise<Record<string, string>> {
  const data = await fetchAllData();
  return data?.settings || {};
}

export async function updateSettings(data: Record<string, string>): Promise<void> {
  return enqueueWrite(async () => {
    const current = await getSettings();
    await updateData({ settings: { ...current, ...data } });
  });
}

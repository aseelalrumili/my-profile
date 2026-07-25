import axios from 'axios';
import type { AppData } from '../types';
import { fallbackData } from '../fallbackData';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchAllData(): Promise<AppData | null> {
  try {
    const { data } = await API.get('/data');
    if (data && data.profile) return data as AppData;
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
  const data = await fetchAllData();
  const items = (data?.[key as keyof AppData] as unknown as T[]) || [];
  const maxId = items.length ? Math.max(...items.map((i) => i.id)) : 0;
  const newItem = { ...item, id: maxId + 1 } as T;
  items.push(newItem);
  await updateData({ [key]: items });
  return newItem;
}

export async function updateItem<T extends { id: number }>(key: string, id: number, patch: Partial<T>): Promise<T> {
  const data = await fetchAllData();
  const items = (data?.[key as keyof AppData] as unknown as T[]) || [];
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Not found');
  items[idx] = { ...items[idx], ...patch };
  await updateData({ [key]: items });
  return items[idx];
}

export async function removeItem<T extends { id: number }>(key: string, id: number): Promise<void> {
  const data = await fetchAllData();
  const items = (data?.[key as keyof AppData] as unknown as T[]) || [];
  await updateData({ [key]: items.filter((i) => i.id !== id) });
}

export async function getObject<K extends keyof AppData>(key: K): Promise<AppData[K]> {
  const data = await fetchAllData();
  if (data && key in data) return data[key];
  return fallbackData[key];
}

export async function updateObject<K extends keyof AppData>(key: K, patch: Partial<AppData[K]>): Promise<void> {
  const current = await getObject(key);
  const updated = typeof current === 'object' && !Array.isArray(current)
    ? { ...current, ...patch }
    : patch;
  await updateData({ [key]: updated });
}

export async function getSettings(): Promise<Record<string, string>> {
  const data = await fetchAllData();
  return data?.settings || {};
}

export async function updateSettings(data: Record<string, string>): Promise<void> {
  const current = await getSettings();
  await updateData({ settings: { ...current, ...data } });
}

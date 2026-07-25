import type { ResumeVersion, ResumeSettings } from '../core/types/resume';
import { fetchAllData, updateData } from '../core/store';

function generateId(): string {
  return `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function fetchResumeVersions(): Promise<ResumeVersion[]> {
  const data = await fetchAllData();
  return data?.resumeVersions || [];
}

export async function getResumeVersion(id: string): Promise<ResumeVersion | undefined> {
  const versions = await fetchResumeVersions();
  return versions.find(v => v.id === id);
}

export async function getDefaultResume(type: 'ats' | 'regular'): Promise<ResumeVersion | undefined> {
  const versions = await fetchResumeVersions();
  return versions.find(v => v.type === type && v.isDefault);
}

export async function createResumeVersion(
  name: string,
  type: 'ats' | 'regular',
  settings: ResumeSettings
): Promise<ResumeVersion> {
  const versions = await fetchResumeVersions();
  const newVersion: ResumeVersion = {
    id: generateId(),
    name,
    type,
    settings,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  versions.push(newVersion);
  await updateData({ resumeVersions: versions });
  return newVersion;
}

export async function updateResumeVersion(
  id: string,
  patch: Partial<Pick<ResumeVersion, 'name' | 'settings' | 'isDefault'>>
): Promise<ResumeVersion> {
  const versions = await fetchResumeVersions();
  const idx = versions.findIndex(v => v.id === id);
  if (idx === -1) throw new Error('Resume version not found');

  if (patch.isDefault) {
    for (const v of versions) {
      if (v.type === versions[idx].type) v.isDefault = false;
    }
  }

  versions[idx] = {
    ...versions[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await updateData({ resumeVersions: versions });
  return versions[idx];
}

export async function deleteResumeVersion(id: string): Promise<void> {
  const versions = await fetchResumeVersions();
  const filtered = versions.filter(v => v.id !== id);
  await updateData({ resumeVersions: filtered });
}

export async function cloneResumeVersion(id: string, newName: string): Promise<ResumeVersion> {
  const versions = await fetchResumeVersions();
  const source = versions.find(v => v.id === id);
  if (!source) throw new Error('Resume version not found');

  const clone: ResumeVersion = {
    id: generateId(),
    name: newName,
    type: source.type,
    settings: JSON.parse(JSON.stringify(source.settings)),
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  versions.push(clone);
  await updateData({ resumeVersions: versions });
  return clone;
}

export async function setDefaultResume(id: string): Promise<void> {
  await updateResumeVersion(id, { isDefault: true });
}

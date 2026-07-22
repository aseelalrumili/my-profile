import axios from 'axios';

export const API_BASE = '/api';

export const API = axios.create({ baseURL: API_BASE });

export const getUploadUrl = (path: string): string => {
  if (!path) return path;
  if (path.startsWith('data:')) return path;
  return path;
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export async function convertToWebP(file: File, quality = 0.8): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/webp', quality)
  );
  return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
}

export async function uploadImage(file: File): Promise<string> {
  const converted = await convertToWebP(file);
  return await fileToBase64(converted);
}

export async function uploadFile(file: File): Promise<string> {
  return await fileToBase64(file);
}

export function cacheImage(url: string, data: string): void {
  if (url.startsWith('data:')) return;
  try { localStorage.setItem('img:' + url, data); } catch {}
}

export function getCachedImage(url: string): string | null {
  if (!url || url.startsWith('data:')) return null;
  try { return localStorage.getItem('img:' + url) || null; } catch { return null; }
}

API.interceptors.request.use(function (config) {
  var token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

API.interceptors.response.use(
  function (response) { return response; },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

import axios from 'axios';

export const API_BASE = '/api';

export const API = axios.create({ baseURL: API_BASE });

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  const base64 = await fileToBase64(converted);
  const base64Data = base64.split(',')[1];

  const token = localStorage.getItem('token');
  const { data } = await axios.post('/api/data/upload', {
    filename: converted.name,
    data: base64Data,
    contentType: 'image/webp',
  }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return data.url;
}

export async function uploadFile(file: File): Promise<string> {
  return uploadImage(file);
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
      localStorage.removeItem('email');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

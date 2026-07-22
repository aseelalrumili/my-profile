import axios from 'axios';

export const API_BASE = '/api';

export const API = axios.create({ baseURL: API_BASE });

export const getUploadUrl = (path: string): string => {
  if (!path) return path;
  return path;
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

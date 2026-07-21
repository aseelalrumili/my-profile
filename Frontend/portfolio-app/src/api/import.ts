import { API } from './client';

export const importData = async (payload: any): Promise<any> => (await API.post('/import', payload)).data;

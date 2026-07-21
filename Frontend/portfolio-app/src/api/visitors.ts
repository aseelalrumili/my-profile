import type { Visitor } from '../types';
import { API } from './client';

export const fetchVisitors = async (): Promise<Visitor[]> => (await API.get('/visitors')).data;
export const trackVisitor = async (page: string): Promise<void> => { await API.post('/visitors/track', { page }); };
export const fetchVisitorAnalytics = async (): Promise<any> => (await API.get('/visitors/analytics')).data;

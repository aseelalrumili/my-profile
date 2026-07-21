import type { Message } from '../types';
import { API } from './client';

export const fetchMessages = async (): Promise<Message[]> => (await API.get('/messages')).data;
export const sendMessage = async (msg: Partial<Message>): Promise<Message> => (await API.post('/messages', msg)).data;
export const markMessageRead = async (id: number): Promise<void> => { await API.put(`/messages/${id}/read`); };
export const deleteMessage = async (id: number): Promise<void> => { await API.delete(`/messages/${id}`); };

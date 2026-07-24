import type { Message } from '../../types';
import * as store from '../../core/store';

export const fetchMessages = async (): Promise<Message[]> => store.getAll<Message>('messages');

export const sendMessage = async (data: Omit<Message, 'id' | 'isRead' | 'createdAt'>): Promise<Message> => {
  return store.add<Message>('messages', {
    ...data,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
};

export const markMessageRead = async (id: number) => {
  return store.update<Message>('messages', id, { isRead: true });
};

export const deleteMessage = async (id: number) => {
  store.remove<Message>('messages', id);
};

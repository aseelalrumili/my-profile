import type { Message } from '../../types';
import { getCollection, addItem, updateItem, removeItem } from '../../core/store';

export const fetchMessages = (): Promise<Message[]> => getCollection<Message>('messages');

export const sendMessage = async (data: Omit<Message, 'id' | 'isRead' | 'createdAt'>): Promise<Message> => {
  return addItem<Message>('messages', {
    ...data,
    isRead: false,
    createdAt: new Date().toISOString(),
  });
};

export const markMessageRead = (id: number) => updateItem<Message>('messages', id, { isRead: true } as any);
export const deleteMessage = (id: number) => removeItem<Message>('messages', id);

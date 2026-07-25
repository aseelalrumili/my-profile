export interface Message {
  id: number;
  name: string;
  phone?: string;
  subject?: string;
  messageText: string;
  isRead: boolean;
  createdAt: string;
}

export interface Visitor {
  id: number;
  ipAddress?: string;
  userAgent?: string;
  page?: string;
  visitedAt: string;
}

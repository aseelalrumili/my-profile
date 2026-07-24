export interface Message {
  id: number;
  name: string;
  email: string;
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

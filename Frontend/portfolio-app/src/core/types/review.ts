export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

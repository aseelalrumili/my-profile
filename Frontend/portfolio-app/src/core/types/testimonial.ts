export interface Testimonial {
  id: number;
  clientName: string;
  clientNameAr?: string;
  clientTitle?: string;
  clientTitleAr?: string;
  avatarUrl?: string;
  content: string;
  contentAr?: string;
  rating: number;
  sortOrder: number;
}

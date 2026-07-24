export interface BlogPost {
  id: number;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt?: string;
  excerptAr?: string;
  content: string;
  contentAr?: string;
  coverImageUrl?: string;
  author?: string;
  tags?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: number;
  blogPostId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: number;
  mediaType: 'Image' | '3DModel';
  url: string;
  fileName?: string;
  isPrimary: boolean;
}

export interface Project {
  id: number;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  type: 'Design' | 'Code' | 'Full-stack';
  category?: string;
  techStack?: string;
  liveUrl?: string;
  sortOrder: number;
  media: MediaItem[];
  problem?: string;
  problemAr?: string;
  solution?: string;
  solutionAr?: string;
  role?: string;
  roleAr?: string;
  impact?: string;
  impactAr?: string;
}

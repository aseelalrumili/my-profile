export interface Profile {
  id: number;
  fullName: string;
  fullNameAr?: string;
  jobTitle: string;
  jobTitleAr?: string;
  bio?: string;
  bioAr?: string;
  photoUrl?: string;
  resumeUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  locationAr?: string;
  heroEffect: 'Parallax' | 'Hologram' | '3DPlane';
  themeColor: string;
  statsProjects: number;
  statsExperience: number;
  statsClients: number;
  statsAwards: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
}

export interface Skill {
  id: number;
  name: string;
  nameAr?: string;
  category: string;
  categoryAr?: string;
  type: 'Design' | 'Development';
  percentage: number;
  sortOrder: number;
}

export interface Experience {
  id: number;
  title: string;
  titleAr?: string;
  company?: string;
  companyAr?: string;
  period?: string;
  description?: string;
  descriptionAr?: string;
  sortOrder: number;
}

export interface Education {
  id: number;
  degree: string;
  degreeAr?: string;
  institution?: string;
  institutionAr?: string;
  period?: string;
  description?: string;
  descriptionAr?: string;
  sortOrder: number;
}

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

export interface Certification {
  id: number;
  name: string;
  nameAr?: string;
  issuer: string;
  issuerAr?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  logoUrl?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  category?: string;
  categoryAr?: string;
  sortOrder: number;
}

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

export interface BlogComment {
  id: number;
  blogPostId: number;
  authorName: string;
  authorEmail: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  expiration: string;
}

export interface AppData {
  profile: Profile;
  socialLinks: SocialLink[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  reviews: Review[];
  settings: Record<string, string>;
}

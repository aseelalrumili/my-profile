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

import type { Profile, SocialLink, Skill, Experience, Education } from './profile';
import type { Project } from './project';
import type { Certification } from './certification';
import type { BlogPost } from './blog';
import type { Testimonial } from './testimonial';
import type { Review } from './review';
import type { ResumeVersion } from './resume';
import type { Message } from './message';

export interface LoginResponse {
  token: string;
  email: string;
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
  messages: Message[];
  settings: Record<string, string>;
  resumeVersions: ResumeVersion[];
}

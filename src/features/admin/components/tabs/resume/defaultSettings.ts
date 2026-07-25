import type { ResumeSettings } from '@/core/types/resume';

export const defaultResumeSettings: ResumeSettings = {
  layout: {
    type: 'single',
    pageMargin: 40,
    sectionGap: 16,
    sectionPadding: 16,
    sectionBorderRadius: 4,
    showPhoto: true,
    photoSize: 100,
    photoShape: 'circle',
  },
  colors: {
    pageBg: '#ffffff',
    sectionBg: '#f8f9fa',
    primaryText: '#1a1a1a',
    secondaryText: '#555555',
    headingText: '#1a1a1a',
    accent: '#2563eb',
    borderColor: '#dee2e6',
    skillBg: '#e9ecef',
    skillText: '#333333',
  },
  fonts: {
    fontFamily: 'Arial',
    headingSize: 14,
    headingWeight: 700,
    titleSize: 24,
    titleWeight: 700,
    bodySize: 11,
    bodyLineHeight: 1.6,
    metaSize: 10,
  },
  sections: [
    { id: 'summary', type: 'summary', title: 'Summary', titleAr: 'الملخص', visible: true },
    { id: 'skills', type: 'skills', title: 'Skills', titleAr: 'المهارات', visible: true },
    { id: 'experience', type: 'experience', title: 'Experience', titleAr: 'الخبرة', visible: true },
    { id: 'education', type: 'education', title: 'Education', titleAr: 'التعليم', visible: true },
    { id: 'certifications', type: 'certifications', title: 'Certifications', titleAr: 'الشهادات', visible: true },
  ],
};

export const defaultAtsSettings: ResumeSettings = {
  layout: {
    type: 'single',
    pageMargin: 32,
    sectionGap: 12,
    sectionPadding: 8,
    sectionBorderRadius: 0,
    showPhoto: false,
    photoSize: 0,
    photoShape: 'circle',
  },
  colors: {
    pageBg: '#ffffff',
    sectionBg: '#ffffff',
    primaryText: '#000000',
    secondaryText: '#333333',
    headingText: '#000000',
    accent: '#000000',
    borderColor: '#cccccc',
    skillBg: '#ffffff',
    skillText: '#000000',
  },
  fonts: {
    fontFamily: 'Arial',
    headingSize: 13,
    headingWeight: 700,
    titleSize: 20,
    titleWeight: 700,
    bodySize: 11,
    bodyLineHeight: 1.5,
    metaSize: 10,
  },
  sections: [
    { id: 'summary', type: 'summary', title: 'Summary', titleAr: 'الملخص', visible: true },
    { id: 'skills', type: 'skills', title: 'Skills', titleAr: 'المهارات', visible: true },
    { id: 'experience', type: 'experience', title: 'Experience', titleAr: 'الخبرة', visible: true },
    { id: 'education', type: 'education', title: 'Education', titleAr: 'التعليم', visible: true },
    { id: 'certifications', type: 'certifications', title: 'Certifications', titleAr: 'الشهادات', visible: true },
  ],
};

export const FONT_OPTIONS = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Roboto',
  'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Cairo',
  'Inter', 'Poppins',
];

export const STORAGE_KEY = 'resume_settings';

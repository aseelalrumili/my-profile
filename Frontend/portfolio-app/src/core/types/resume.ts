export interface ResumeLayout {
  type: 'single' | 'two-column';
  pageMargin: number;
  sectionGap: number;
  sectionPadding: number;
  sectionBorderRadius: number;
  showPhoto: boolean;
  photoSize: number;
  photoShape: 'circle' | 'square' | 'rounded';
}

export interface ResumeColors {
  pageBg: string;
  sectionBg: string;
  primaryText: string;
  secondaryText: string;
  headingText: string;
  accent: string;
  borderColor: string;
  skillBg: string;
  skillText: string;
}

export interface ResumeFonts {
  fontFamily: string;
  headingSize: number;
  headingWeight: number;
  titleSize: number;
  titleWeight: number;
  bodySize: number;
  bodyLineHeight: number;
  metaSize: number;
}

export type ResumeSectionType = 'summary' | 'skills' | 'experience' | 'education' | 'certifications' | 'custom';

export interface ResumeSection {
  id: string;
  type: ResumeSectionType;
  title: string;
  titleAr: string;
  visible: boolean;
  customContent?: string;
  customContentAr?: string;
}

export interface ResumeSettings {
  layout: ResumeLayout;
  colors: ResumeColors;
  fonts: ResumeFonts;
  sections: ResumeSection[];
}

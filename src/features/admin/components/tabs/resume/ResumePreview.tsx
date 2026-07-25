import type { ResumeSettings } from '@/core/types/resume';
import type { AppData } from '@/types';
import ResumeHeader from './sections/ResumeHeader';
import ResumeSummary from './sections/ResumeSummary';
import ResumeSkills from './sections/ResumeSkills';
import ResumeExperience from './sections/ResumeExperience';
import ResumeEducation from './sections/ResumeEducation';
import ResumeCertifications from './sections/ResumeCertifications';
import ResumeCustomSection from './sections/ResumeCustomSection';

interface Props {
  data: AppData;
  settings: ResumeSettings;
  isAr: boolean;
}

export default function ResumePreview({ data, settings, isAr }: Props) {
  const { layout, colors, fonts, sections } = settings;
  const { profile, skills = [], experience = [], education = [], certifications = [] } = data;

  const bio = isAr && profile.bioAr ? profile.bioAr : profile.bio;

  const sectionTitleStyle = {
    fontSize: fonts.headingSize,
    fontWeight: fonts.headingWeight,
    color: colors.headingText,
    fontFamily: fonts.fontFamily,
    borderBottom: `2px solid ${colors.accent}`,
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const getSectionTitle = (s: typeof sections[0]) => isAr ? s.titleAr : s.title;

  const visibleSections = sections.filter((s) => s.visible);

  const renderSectionContent = (section: typeof sections[0]) => {
    switch (section.type) {
      case 'summary':
        return bio ? <ResumeSummary text={bio} settings={settings} /> : null;
      case 'skills':
        return skills.length > 0 ? <ResumeSkills skills={skills} settings={settings} isAr={isAr} /> : null;
      case 'experience':
        return experience.length > 0 ? <ResumeExperience items={experience} settings={settings} isAr={isAr} /> : null;
      case 'education':
        return education.length > 0 ? <ResumeEducation items={education} settings={settings} isAr={isAr} /> : null;
      case 'certifications':
        return certifications.length > 0 ? <ResumeCertifications items={certifications} settings={settings} isAr={isAr} /> : null;
      case 'custom':
        return <ResumeCustomSection title={getSectionTitle(section)} content={isAr ? (section.customContentAr || '') : (section.customContent || '')} settings={settings} />;
      default:
        return null;
    }
  };

  const renderSection = (section: typeof sections[0]) => {
    const content = renderSectionContent(section);
    if (!content) return null;

    if (layout.type === 'two-column' && ['skills', 'custom'].includes(section.type)) {
      return (
        <div key={section.id} style={{
          background: colors.sectionBg,
          padding: layout.sectionPadding,
          borderRadius: layout.sectionBorderRadius,
          border: `1px solid ${colors.borderColor}`,
        }}>
          <h2 style={sectionTitleStyle}>{getSectionTitle(section)}</h2>
          {content}
        </div>
      );
    }

    return (
      <div key={section.id} style={{
        background: colors.sectionBg,
        padding: layout.sectionPadding,
        borderRadius: layout.sectionBorderRadius,
        border: `1px solid ${colors.borderColor}`,
      }}>
        <h2 style={sectionTitleStyle}>{getSectionTitle(section)}</h2>
        {content}
      </div>
    );
  };

  const sidebarSections = visibleSections.filter((s) => ['skills', 'custom'].includes(s.type));
  const mainSections = visibleSections.filter((s) => !['skills', 'custom'].includes(s.type));

  if (layout.type === 'two-column') {
    return (
      <div id="resume-admin-preview" style={{
        background: colors.pageBg,
        padding: layout.pageMargin,
        fontFamily: fonts.fontFamily,
        color: colors.primaryText,
        minHeight: '100%',
      }}>
        <ResumeHeader profile={profile} settings={settings} isAr={isAr} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: layout.sectionGap, marginTop: layout.sectionGap }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: layout.sectionGap }}>
            {sidebarSections.map(renderSection)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: layout.sectionGap }}>
            {mainSections.map(renderSection)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="resume-admin-preview" style={{
      background: colors.pageBg,
      padding: layout.pageMargin,
      fontFamily: fonts.fontFamily,
      color: colors.primaryText,
      minHeight: '100%',
    }}>
      <ResumeHeader profile={profile} settings={settings} isAr={isAr} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: layout.sectionGap, marginTop: layout.sectionGap }}>
        {visibleSections.map(renderSection)}
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import type { ResumeSettings } from '@/core/types/resume';
import type { AppData } from '@/types';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  data: AppData;
  settings: ResumeSettings;
}

export default function ResumePDF({ data, settings }: Props) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();
  const { layout, colors, fonts, sections } = settings;
  const { profile, skills = [], experience = [], education = [], certifications = [] } = data;

  const name = local(profile, 'fullName');
  const title = local(profile, 'jobTitle');
  const bio = local(profile, 'bio');
  const location = local(profile, 'location');

  const visibleSections = sections.filter((s) => s.visible);
  const photoRadius = layout.photoShape === 'circle' ? '50%' : layout.photoShape === 'rounded' ? '12px' : '0';

  const sectionBorder = `2px solid ${colors.accent}`;

  const getSectionTitle = (s: typeof sections[0]) => local(s, 'title');

  const getSectionContent = (section: typeof sections[0]): string => {
    switch (section.type) {
      case 'summary':
        return bio || '';
      case 'skills':
        return skills.map((s) => local(s, 'name')).join(' | ');
      case 'experience':
        return experience.map((exp) => {
          const lines = [];
          const expTitle = local(exp, 'title');
          const expCompany = local(exp, 'company');
          const expDesc = local(exp, 'description');
          lines.push(`${expTitle}${expCompany ? ` - ${expCompany}` : ''}`);
          if (exp.period) lines.push(`  ${exp.period}`);
          if (expDesc) lines.push(`  ${expDesc}`);
          return lines.join('\n');
        }).join('\n\n');
      case 'education':
        return education.map((edu) => {
          const lines = [];
          const eduDegree = local(edu, 'degree');
          const eduInst = local(edu, 'institution');
          lines.push(`${eduDegree}${eduInst ? ` - ${eduInst}` : ''}`);
          if (edu.period) lines.push(`  ${edu.period}`);
          if (edu.description) lines.push(`  ${edu.description}`);
          return lines.join('\n');
        }).join('\n\n');
      case 'certifications':
        return certifications.map((cert) => {
          const certName = local(cert, 'name');
          const certIssuer = local(cert, 'issuer');
          return `${certName}${certIssuer ? ` - ${certIssuer}` : ''}${cert.issueDate ? ` (${cert.issueDate})` : ''}`;
        }).join('\n');
      case 'custom':
        return local(section, 'customContent') || '';
      default:
        return '';
    }
  };

  const handlePrint = () => {
    const el = document.getElementById('resume-admin-preview');
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;

    const photoHtml = layout.showPhoto && profile.photoUrl
      ? `<img src="${profile.photoUrl}" style="width:${layout.photoSize}px;height:${layout.photoSize}px;object-fit:cover;border-radius:${photoRadius};flex-shrink:0" />`
      : '';

    const sectionsHtml = visibleSections.map((section) => {
      const content = getSectionContent(section);
      if (!content) return '';
      return `
        <div style="background:${colors.sectionBg};padding:${layout.sectionPadding}px;border-radius:${layout.sectionBorderRadius}px;border:1px solid ${colors.borderColor}">
          <h2 style="font-size:${fonts.headingSize}px;font-weight:${fonts.headingWeight};color:${colors.headingText};font-family:${fonts.fontFamily};border-bottom:${sectionBorder};padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px">${getSectionTitle(section)}</h2>
          ${section.type === 'skills'
            ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${skills.map((s) => `<span style="background:${colors.skillBg};color:${colors.skillText};padding:3px 10px;border-radius:4px;font-size:${fonts.metaSize}px;font-family:${fonts.fontFamily}">${local(s, 'name')}</span>`).join('')}</div>`
            : `<pre style="font-size:${fonts.bodySize}px;line-height:${fonts.bodyLineHeight};color:${colors.primaryText};font-family:${fonts.fontFamily};white-space:pre-wrap;margin:0;border:none;background:none;padding:0">${content}</pre>`
          }
        </div>
      `;
    }).join('');

    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume - ${name}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:${fonts.fontFamily};font-size:${fonts.bodySize}px;color:${colors.primaryText};line-height:${fonts.bodyLineHeight};padding:${layout.pageMargin}px;background:${colors.pageBg}}
      @media print{body{padding:${layout.pageMargin / 2}px}}
    </style></head><body>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:${layout.sectionGap}px">
        ${photoHtml}
        <div>
          <h1 style="font-size:${fonts.titleSize}px;font-weight:${fonts.titleWeight};color:${colors.headingText};font-family:${fonts.fontFamily};margin-bottom:2px;line-height:1.2">${name}</h1>
          <p style="font-size:${fonts.metaSize + 1}px;color:${colors.accent};font-family:${fonts.fontFamily};margin-bottom:6px">${title}</p>
          <div style="font-size:${fonts.metaSize}px;color:${colors.secondaryText};font-family:${fonts.fontFamily};display:flex;flex-wrap:wrap;gap:10px">
            ${profile.email ? `<span>${profile.email}</span>` : ''}
            ${profile.phone ? `<span>${profile.phone}</span>` : ''}
            ${location ? `<span>${location}</span>` : ''}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:${layout.sectionGap}px">
        ${sectionsHtml}
      </div>
    </body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <button className="btn btn-secondary btn-sm" onClick={handlePrint}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      🖨 {t('resume.print')}
    </button>
  );
}

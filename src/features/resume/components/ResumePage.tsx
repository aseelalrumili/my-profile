import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPrinter, FiDownload, FiFileText } from 'react-icons/fi';
import type { AppData } from '../../../types';
import type { ResumeSettings } from '../../../core/types/resume';
import { defaultAtsSettings } from '../../admin/components/tabs/resume/defaultSettings';

interface Props {
  data: AppData | null;
}

export default function ResumePage({ data }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState<'ats' | 'regular'>('ats');

  const settings: ResumeSettings = useMemo(() => {
    if (!data?.resumeVersions) return defaultAtsSettings;
    const versions = data.resumeVersions;
    const defaultVersion = versions.find(v => v.type === activeTab && v.isDefault);
    if (defaultVersion) return defaultVersion.settings;
    const fallback = versions.find(v => v.type === activeTab);
    if (fallback) return fallback.settings;
    return defaultAtsSettings;
  }, [data?.resumeVersions, activeTab]);

  if (!data) return <div className="section"><p>{t('loading')}</p></div>;

  const { profile, skills = [], experience = [], education = [], certifications = [] } = data;
  const { layout, colors, fonts, sections } = settings;

  const name = isAr && profile.fullNameAr ? profile.fullNameAr : profile.fullName;
  const title = isAr && profile.jobTitleAr ? profile.jobTitleAr : profile.jobTitle;
  const bio = isAr && profile.bioAr ? profile.bioAr : profile.bio;
  const location = isAr && profile.locationAr ? profile.locationAr : profile.location;

  const visibleSections = sections.filter((s) => s.visible);
  const photoRadius = layout.photoShape === 'circle' ? '50%' : layout.photoShape === 'rounded' ? '12px' : '0';

  const getSectionTitle = (s: typeof sections[0]) => isAr ? s.titleAr : s.title;

  const getSectionContent = (section: typeof sections[0]): string => {
    switch (section.type) {
      case 'summary': return bio || '';
      case 'skills': return skills.map((s) => isAr && s.nameAr ? s.nameAr : s.name).join(' | ');
      case 'experience':
        return experience.map((exp) => {
          const lines = [];
          const expTitle = isAr && exp.titleAr ? exp.titleAr : exp.title;
          const expCompany = isAr && exp.companyAr ? exp.companyAr : exp.company;
          const expDesc = isAr && exp.descriptionAr ? exp.descriptionAr : exp.description;
          lines.push(`${expTitle}${expCompany ? ` - ${expCompany}` : ''}`);
          if (exp.period) lines.push(`  ${exp.period}`);
          if (expDesc) lines.push(`  ${expDesc}`);
          return lines.join('\n');
        }).join('\n\n');
      case 'education':
        return education.map((edu) => {
          const lines = [];
          const eduDegree = isAr && edu.degreeAr ? edu.degreeAr : edu.degree;
          const eduInst = isAr && edu.institutionAr ? edu.institutionAr : edu.institution;
          lines.push(`${eduDegree}${eduInst ? ` - ${eduInst}` : ''}`);
          if (edu.period) lines.push(`  ${edu.period}`);
          if (edu.description) lines.push(`  ${edu.description}`);
          return lines.join('\n');
        }).join('\n\n');
      case 'certifications':
        return certifications.map((cert) => {
          const certName = isAr && cert.nameAr ? cert.nameAr : cert.name;
          const certIssuer = isAr && cert.issuerAr ? cert.issuerAr : cert.issuer;
          return `${certName}${certIssuer ? ` - ${certIssuer}` : ''}${cert.issueDate ? ` (${cert.issueDate})` : ''}`;
        }).join('\n');
      case 'custom':
        return isAr ? (section.customContentAr || '') : (section.customContent || '');
      default:
        return '';
    }
  };

  const buildPlainText = (): string => {
    const lines: string[] = [];
    const sep = '='.repeat(50);
    const sepShort = '-'.repeat(40);

    lines.push(name.toUpperCase());
    lines.push(title);
    const contactParts: string[] = [];
    if (profile.email) contactParts.push(profile.email);
    if (profile.phone) contactParts.push(profile.phone);
    if (location) contactParts.push(location);
    if (contactParts.length) lines.push(contactParts.join(' | '));
    lines.push('');

    for (const section of visibleSections) {
      const content = getSectionContent(section);
      if (!content) continue;

      lines.push(sep);
      lines.push(getSectionTitle(section).toUpperCase());
      lines.push(sepShort);

      if (section.type === 'skills') {
        lines.push(skills.map((s) => isAr && s.nameAr ? s.nameAr : s.name).join(', '));
      } else {
        lines.push(content);
      }
      lines.push('');
    }

    return lines.join('\n');
  };

  const handleDownloadTxt = () => {
    const text = buildPlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-ats-${isAr ? 'ar' : 'en'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const el = document.getElementById('resume-content');
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
          <h2 style="font-size:${fonts.headingSize}px;font-weight:${fonts.headingWeight};color:${colors.headingText};font-family:${fonts.fontFamily};border-bottom:2px solid ${colors.accent};padding-bottom:4px;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.5px">${getSectionTitle(section)}</h2>
          ${section.type === 'skills'
            ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${skills.map((s) => `<span style="background:${colors.skillBg};color:${colors.skillText};padding:3px 10px;border-radius:4px;font-size:${fonts.metaSize}px;font-family:${fonts.fontFamily}">${isAr && s.nameAr ? s.nameAr : s.name}</span>`).join('')}</div>`
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

  const photoRadiusStyle = layout.photoShape === 'circle' ? '50%' : layout.photoShape === 'rounded' ? '12px' : '0';

  const sectionBorder = `2px solid ${colors.accent}`;

  return (
    <main className="resume-page" style={{ background: colors.pageBg }}>
      <div className="resume-actions no-print" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['ats', 'regular'] as const).map(tab => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'ats' ? t('resume.ats') : t('resume.standard')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiPrinter /> {t('resume.print')}
          </button>
          <button className="btn btn-outline btn-sm" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiDownload /> PDF
          </button>
          {activeTab === 'ats' && (
            <button className="btn btn-outline btn-sm" onClick={handleDownloadTxt} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiFileText /> TXT
            </button>
          )}
        </div>
      </div>

      <div
        id="resume-content"
        className="resume-content"
        style={{
          maxWidth: 800,
          margin: '0 auto',
          fontFamily: fonts.fontFamily,
          fontSize: fonts.bodySize,
          lineHeight: fonts.bodyLineHeight,
          color: colors.primaryText,
          background: colors.pageBg,
          padding: layout.pageMargin,
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: layout.sectionGap }}>
          {layout.showPhoto && profile.photoUrl && (
            <img
              src={profile.photoUrl}
              alt={name}
              style={{
                width: layout.photoSize,
                height: layout.photoSize,
                objectFit: 'cover',
                borderRadius: photoRadiusStyle,
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <h1 style={{ fontSize: fonts.titleSize, fontWeight: fonts.titleWeight, color: colors.headingText, marginBottom: 2, lineHeight: 1.2 }}>{name}</h1>
            <p style={{ fontSize: fonts.metaSize + 1, color: colors.accent, marginBottom: 6 }}>{title}</p>
            <div style={{ fontSize: fonts.metaSize, color: colors.secondaryText, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {location && <span>{location}</span>}
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: layout.sectionGap }}>
          {visibleSections.map((section) => {
            const content = getSectionContent(section);
            if (!content) return null;

            return (
              <div
                key={section.id}
                style={{
                  background: colors.sectionBg,
                  padding: layout.sectionPadding,
                  borderRadius: layout.sectionBorderRadius,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                <h2 style={{
                  fontSize: fonts.headingSize,
                  fontWeight: fonts.headingWeight,
                  color: colors.headingText,
                  borderBottom: sectionBorder,
                  paddingBottom: 4,
                  margin: '0 0 10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {getSectionTitle(section)}
                </h2>
                {section.type === 'skills' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {skills.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          background: colors.skillBg,
                          color: colors.skillText,
                          padding: '3px 10px',
                          borderRadius: 4,
                          fontSize: fonts.metaSize,
                        }}
                      >
                        {isAr && s.nameAr ? s.nameAr : s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <pre style={{
                    fontSize: fonts.bodySize,
                    lineHeight: fonts.bodyLineHeight,
                    color: colors.primaryText,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    fontFamily: fonts.fontFamily,
                  }}>
                    {content}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

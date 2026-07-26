import { useTranslation } from 'react-i18next';
import { FiDownload } from 'react-icons/fi';
import type { AppData } from '@/types';
import type { ResumeSettings } from '@/core/types/resume';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  data: AppData;
  settings: ResumeSettings;
}

export default function AtsResumeBuilder({ data, settings }: Props) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();

  const { profile, skills = [], experience = [], education = [], certifications = [] } = data;
  const { sections } = settings;

  const name = local(profile, 'fullName') || profile.fullName;
  const title = local(profile, 'jobTitle') || profile.jobTitle;
  const bio = local(profile, 'bio') || profile.bio;
  const location = local(profile, 'location') || profile.location;

  const visibleSections = sections.filter((s) => s.visible);

  const getSectionTitle = (s: typeof sections[0]) => local(s, 'title');

  const getSectionContent = (section: typeof sections[0]): string => {
    switch (section.type) {
      case 'summary': return bio || '';
      case 'skills': return skills.map((s) => local(s, 'name')).join(' | ');
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
      lines.push((getSectionTitle(section) || '').toUpperCase());
      lines.push(sepShort);

      if (section.type === 'skills') {
        lines.push(skills.map((s) => local(s, 'name')).join(', '));
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

  const plainText = buildPlainText();

  return (
    <>
      <div className="resume-actions no-print" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleDownloadTxt}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <FiDownload /> PDF
        </button>
      </div>
      <div
        id="resume-content"
        className="resume-content"
        style={{
          maxWidth: 800,
          margin: '0 auto',
          fontFamily: settings.fonts.fontFamily,
          fontSize: settings.fonts.bodySize,
          lineHeight: settings.fonts.bodyLineHeight,
          color: settings.colors.primaryText,
          background: settings.colors.pageBg,
          padding: settings.layout.pageMargin,
        }}
      >
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: settings.fonts.bodySize,
            lineHeight: settings.fonts.bodyLineHeight,
            color: settings.colors.primaryText,
            margin: 0,
            border: 'none',
            background: 'none',
            padding: 0,
          }}
        >
          {plainText}
        </pre>
      </div>
    </>
  );
}

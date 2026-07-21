import { useTranslation } from 'react-i18next';
import { FiPrinter, FiDownload } from 'react-icons/fi';
import type { AppData } from '../types';

export default function ResumePage({ data }: { data: AppData | null }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  if (!data) return <div className="section"><p>{t('loading')}</p></div>;

  const { profile, skills, experience, education, certifications } = data;

  const handlePrint = () => window.print();

  const handleDownloadPdf = () => {
    const printContent = document.getElementById('resume-content');
    if (!printContent) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume - ${profile.fullName}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.5;padding:40px 50px;max-width:800px;margin:0 auto}
      h1{font-size:20pt;font-weight:700;margin-bottom:4px}
      .job-title{font-size:12pt;color:#555;margin-bottom:8px}
      .contact{font-size:10pt;color:#666;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:8px}
      .contact span{white-space:nowrap}
      h2{font-size:13pt;font-weight:700;border-bottom:1.5px solid #333;padding-bottom:4px;margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.5px}
      .item{margin-bottom:12px}
      .item h3{font-size:11pt;font-weight:600}
      .item .meta{font-size:10pt;color:#555;font-style:italic}
      .item p{font-size:10pt;margin-top:4px}
      .skills-list{display:flex;flex-wrap:wrap;gap:6px}
      .skill-tag{background:#f0f0f0;padding:2px 10px;border-radius:3px;font-size:10pt}
      @media print{body{padding:20px 30px}}
    </style></head><body>${printContent.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <main className="resume-page">
      <div className="resume-actions no-print">
        <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPrinter /> {t('resume.print')}
        </button>
        <button className="btn btn-outline" onClick={handleDownloadPdf} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiDownload /> PDF
        </button>
      </div>

      <div id="resume-content" className="resume-content">
        <header className="resume-header">
          <h1>{isAr && profile.fullNameAr ? profile.fullNameAr : profile.fullName}</h1>
          <p className="job-title">{isAr && profile.jobTitleAr ? profile.jobTitleAr : profile.jobTitle}</p>
          <div className="resume-contact">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{isAr && profile.locationAr ? profile.locationAr : profile.location}</span>}
          </div>
        </header>

        {profile.bio && (
          <section className="resume-section">
            <h2>{t('resume.summary')}</h2>
            <p className="resume-text">
              {isAr && profile.bioAr ? profile.bioAr : profile.bio}
            </p>
          </section>
        )}

        {skills.length > 0 && (
          <section className="resume-section">
            <h2>{t('resume.skills')}</h2>
            <div className="resume-skills-list">
              {skills.map((skill) => (
                <span key={skill.id} className="resume-skill-tag">
                  {isAr && skill.nameAr ? skill.nameAr : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="resume-section">
            <h2>{t('resume.experience')}</h2>
            {experience.map((exp) => (
              <article key={exp.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{isAr && exp.titleAr ? exp.titleAr : exp.title}</h3>
                  {exp.period && <span className="resume-period">{exp.period}</span>}
                </div>
                {exp.company && <div className="resume-institution">{isAr && exp.companyAr ? exp.companyAr : exp.company}</div>}
                {exp.description && <p className="resume-description">{isAr && exp.descriptionAr ? exp.descriptionAr : exp.description}</p>}
              </article>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="resume-section">
            <h2>{t('resume.education')}</h2>
            {education.map((edu) => (
              <article key={edu.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{isAr && edu.degreeAr ? edu.degreeAr : edu.degree}</h3>
                  {edu.period && <span className="resume-period">{edu.period}</span>}
                </div>
                {edu.institution && <div className="resume-institution">{isAr && edu.institutionAr ? edu.institutionAr : edu.institution}</div>}
                {edu.description && <p className="resume-description">{edu.description}</p>}
              </article>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="resume-section">
            <h2>{t('resume.certifications')}</h2>
            {certifications.map((cert) => (
              <article key={cert.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{isAr && cert.nameAr ? cert.nameAr : cert.name}</h3>
                  {cert.issueDate && <span className="resume-period">{cert.issueDate}</span>}
                </div>
                <div className="resume-institution">{isAr && cert.issuerAr ? cert.issuerAr : cert.issuer}</div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

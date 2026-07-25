import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPrinter, FiDownload } from 'react-icons/fi';
import type { AppData } from '../../../../types';

type ResumeMode = 'standard' | 'ats';

export default function ResumeTab({ data }: { data: AppData }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [mode, setMode] = useState<ResumeMode>('standard');
  const { profile, skills, experience, education, certifications } = data;

  const pName = isAr && profile.fullNameAr ? profile.fullNameAr : profile.fullName;
  const pTitle = isAr && profile.jobTitleAr ? profile.jobTitleAr : profile.jobTitle;
  const pBio = isAr && profile.bioAr ? profile.bioAr : profile.bio;
  const pLocation = isAr && profile.locationAr ? profile.locationAr : profile.location;

  const handlePrint = () => {
    const el = document.getElementById('resume-admin-preview');
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11pt;color:#1a1a1a;line-height:1.6;padding:40px 50px;max-width:800px;margin:0 auto}h1{font-size:20pt;font-weight:700;margin-bottom:4px}.job-title{font-size:12pt;color:#555;margin-bottom:8px}.contact{font-size:10pt;color:#666;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:8px}h2{font-size:13pt;font-weight:700;border-bottom:1.5px solid #333;padding-bottom:4px;margin:18px 0 8px;text-transform:uppercase;letter-spacing:0.5px}.item{margin-bottom:12px}.item h3{font-size:11pt;font-weight:600}.item .meta{font-size:10pt;color:#555;font-style:italic}.item p{font-size:10pt;margin-top:4px}.skills-list{display:flex;flex-wrap:wrap;gap:6px}.skill-tag{background:#f0f0f0;padding:2px 10px;border-radius:3px;font-size:10pt}@media print{body{padding:20px 30px}}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn btn-sm ${mode === 'standard' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('standard')}>
            {t('resume.standard')}
          </button>
          <button className={`btn btn-sm ${mode === 'ats' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('ats')}>
            {t('resume.ats')}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiPrinter /> {t('resume.print')}
          </button>
        </div>
      </div>

      {mode === 'ats' && (
        <div style={{ padding: '0.5rem 0.75rem', marginBottom: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
          {isAr ? 'ATS: تنسيق نصي بسيط مصمم لآلات قراءة السير الذاتية — بدون ألوان أو أيقونات أو عناصر بصرية.' : 'ATS: Plain text format designed for resume-scanning software — no colors, icons, or visual elements.'}
        </div>
      )}

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'var(--space-4)' }}>
        {mode === 'standard' ? (
          <div id="resume-admin-preview">
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{pName}</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{pTitle}</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {pLocation && <span>{pLocation}</span>}
            </div>

            {pBio && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1.5px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('resume.summary')}</h2>
                <p style={{ fontSize: '0.8rem' }}>{pBio}</p>
              </section>
            )}

            {skills.length > 0 && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1.5px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('resume.skills')}</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map((s) => (
                    <span key={s.id} style={{ background: 'var(--bg-primary)', padding: '2px 10px', borderRadius: '3px', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                      {isAr && s.nameAr ? s.nameAr : s.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {experience.length > 0 && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1.5px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('resume.experience')}</h2>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '0.8rem', fontWeight: 600 }}>{isAr && exp.titleAr ? exp.titleAr : exp.title}</h3>
                      {exp.period && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{exp.period}</span>}
                    </div>
                    {exp.company && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{isAr && exp.companyAr ? exp.companyAr : exp.company}</div>}
                    {exp.description && <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>{isAr && exp.descriptionAr ? exp.descriptionAr : exp.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {education.length > 0 && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1.5px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('resume.education')}</h2>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '0.8rem', fontWeight: 600 }}>{isAr && edu.degreeAr ? edu.degreeAr : edu.degree}</h3>
                      {edu.period && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{edu.period}</span>}
                    </div>
                    {edu.institution && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{isAr && edu.institutionAr ? edu.institutionAr : edu.institution}</div>}
                    {edu.description && <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>{edu.description}</p>}
                  </div>
                ))}
              </section>
            )}

            {certifications.length > 0 && (
              <section style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 700, borderBottom: '1.5px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('resume.certifications')}</h2>
                {certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '0.8rem', fontWeight: 600 }}>{isAr && cert.nameAr ? cert.nameAr : cert.name}</h3>
                      {cert.issueDate && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{cert.issueDate}</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{isAr && cert.issuerAr ? cert.issuerAr : cert.issuer}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
        ) : (
          /* ATS Format — plain text, no styling */
          <div id="resume-admin-preview" style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.8', color: 'var(--text)' }}>
            <div style={{ marginBottom: '16px', borderBottom: '2px solid var(--text)', paddingBottom: '8px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{pName}</div>
              <div>{pTitle}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {[profile.email, profile.phone, pLocation].filter(Boolean).join(' | ')}
              </div>
            </div>

            {pBio && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border)' }}>{t('resume.summary')}</div>
                <div>{pBio}</div>
              </div>
            )}

            {skills.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border)' }}>{t('resume.skills')}</div>
                <div>{skills.map((s) => isAr && s.nameAr ? s.nameAr : s.name).join(' | ')}</div>
              </div>
            )}

            {experience.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border)' }}>{t('resume.experience')}</div>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600 }}>{isAr && exp.titleAr ? exp.titleAr : exp.title}{exp.company ? ` - ${isAr && exp.companyAr ? exp.companyAr : exp.company}` : ''}</div>
                    {exp.period && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{exp.period}</div>}
                    {exp.description && <div style={{ marginTop: '2px' }}>{isAr && exp.descriptionAr ? exp.descriptionAr : exp.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {education.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border)' }}>{t('resume.education')}</div>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600 }}>{isAr && edu.degreeAr ? edu.degreeAr : edu.degree}{edu.institution ? ` - ${isAr && edu.institutionAr ? edu.institutionAr : edu.institution}` : ''}</div>
                    {edu.period && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{edu.period}</div>}
                    {edu.description && <div style={{ marginTop: '2px' }}>{edu.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', borderBottom: '1px solid var(--border)' }}>{t('resume.certifications')}</div>
                {certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: '4px' }}>
                    {isAr && cert.nameAr ? cert.nameAr : cert.name}{cert.issuer ? ` - ${isAr && cert.issuerAr ? cert.issuerAr : cert.issuer}` : ''}{cert.issueDate ? ` (${cert.issueDate})` : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

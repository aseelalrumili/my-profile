import type { ResumeSettings } from '../../../../types/resume';
import type { Certification } from '../../../../types/certification';

interface Props {
  items: Certification[];
  settings: ResumeSettings;
  isAr: boolean;
}

export default function ResumeCertifications({ items, settings, isAr }: Props) {
  const { colors, fonts } = settings;
  return (
    <div>
      {items.map((cert) => (
        <div key={cert.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{
              fontSize: fonts.bodySize,
              fontWeight: 600,
              color: colors.primaryText,
              fontFamily: fonts.fontFamily,
            }}>{isAr && cert.nameAr ? cert.nameAr : cert.name}</h3>
            {cert.issueDate && <span style={{
              fontSize: fonts.metaSize,
              color: colors.secondaryText,
              fontStyle: 'italic',
              fontFamily: fonts.fontFamily,
            }}>{cert.issueDate}</span>}
          </div>
          <div style={{
            fontSize: fonts.metaSize,
            color: colors.accent,
            fontFamily: fonts.fontFamily,
            fontStyle: 'italic',
          }}>{isAr && cert.issuerAr ? cert.issuerAr : cert.issuer}</div>
        </div>
      ))}
    </div>
  );
}

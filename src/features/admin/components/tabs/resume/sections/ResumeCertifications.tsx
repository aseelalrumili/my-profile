import type { ResumeSettings } from '@/core/types/resume';
import type { Certification } from '@/core/types/certification';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  items: Certification[];
  settings: ResumeSettings;
}

export default function ResumeCertifications({ items, settings }: Props) {
  const { local } = useLocale();
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
            }}>{local(cert, 'name')}</h3>
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
          }}>{local(cert, 'issuer')}</div>
        </div>
      ))}
    </div>
  );
}

import type { ResumeSettings } from '@/core/types/resume';
import type { Education } from '@/core/types/profile';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  items: Education[];
  settings: ResumeSettings;
}

export default function ResumeEducation({ items, settings }: Props) {
  const { local } = useLocale();
  const { colors, fonts } = settings;
  return (
    <div>
      {items.map((edu) => (
        <div key={edu.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{
              fontSize: fonts.bodySize,
              fontWeight: 600,
              color: colors.primaryText,
              fontFamily: fonts.fontFamily,
            }}>{local(edu, 'degree')}</h3>
            {edu.period && <span style={{
              fontSize: fonts.metaSize,
              color: colors.secondaryText,
              fontStyle: 'italic',
              fontFamily: fonts.fontFamily,
            }}>{edu.period}</span>}
          </div>
          {edu.institution && <div style={{
            fontSize: fonts.metaSize,
            color: colors.accent,
            fontFamily: fonts.fontFamily,
            fontStyle: 'italic',
          }}>{local(edu, 'institution')}</div>}
          {edu.description && <p style={{
            fontSize: fonts.bodySize,
            lineHeight: fonts.bodyLineHeight,
            color: colors.primaryText,
            fontFamily: fonts.fontFamily,
            marginTop: 4,
          }}>{edu.description}</p>}
        </div>
      ))}
    </div>
  );
}

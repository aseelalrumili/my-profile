import type { ResumeSettings } from '@/core/types/resume';
import type { Experience } from '@/core/types/profile';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  items: Experience[];
  settings: ResumeSettings;
}

export default function ResumeExperience({ items, settings }: Props) {
  const { local } = useLocale();
  const { colors, fonts } = settings;
  return (
    <div>
      {items.map((exp) => (
        <div key={exp.id} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{
              fontSize: fonts.bodySize,
              fontWeight: 600,
              color: colors.primaryText,
              fontFamily: fonts.fontFamily,
            }}>{local(exp, 'title')}</h3>
            {exp.period && <span style={{
              fontSize: fonts.metaSize,
              color: colors.secondaryText,
              fontStyle: 'italic',
              fontFamily: fonts.fontFamily,
            }}>{exp.period}</span>}
          </div>
          {exp.company && <div style={{
            fontSize: fonts.metaSize,
            color: colors.accent,
            fontFamily: fonts.fontFamily,
            fontStyle: 'italic',
          }}>{local(exp, 'company')}</div>}
          {exp.description && <p style={{
            fontSize: fonts.bodySize,
            lineHeight: fonts.bodyLineHeight,
            color: colors.primaryText,
            fontFamily: fonts.fontFamily,
            marginTop: 4,
          }}>{local(exp, 'description')}</p>}
        </div>
      ))}
    </div>
  );
}

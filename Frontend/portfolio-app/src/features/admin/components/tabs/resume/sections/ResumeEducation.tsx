import type { ResumeSettings } from '../../../../types/resume';
import type { Education } from '../../../../types/profile';

interface Props {
  items: Education[];
  settings: ResumeSettings;
  isAr: boolean;
}

export default function ResumeEducation({ items, settings, isAr }: Props) {
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
            }}>{isAr && edu.degreeAr ? edu.degreeAr : edu.degree}</h3>
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
          }}>{isAr && edu.institutionAr ? edu.institutionAr : edu.institution}</div>}
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

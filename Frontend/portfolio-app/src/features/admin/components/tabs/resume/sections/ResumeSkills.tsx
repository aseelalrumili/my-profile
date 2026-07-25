import type { ResumeSettings } from '@/core/types/resume';
import type { Skill } from '@/core/types/profile';

interface Props {
  skills: Skill[];
  settings: ResumeSettings;
  isAr: boolean;
}

export default function ResumeSkills({ skills, settings, isAr }: Props) {
  const { colors, fonts } = settings;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {skills.map((s) => (
        <span key={s.id} style={{
          background: colors.skillBg,
          color: colors.skillText,
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: fonts.metaSize,
          fontFamily: fonts.fontFamily,
        }}>
          {isAr && s.nameAr ? s.nameAr : s.name}
        </span>
      ))}
    </div>
  );
}

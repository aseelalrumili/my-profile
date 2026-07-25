import type { ResumeSettings } from '@/core/types/resume';
import type { Skill } from '@/core/types/profile';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  skills: Skill[];
  settings: ResumeSettings;
}

export default function ResumeSkills({ skills, settings }: Props) {
  const { local } = useLocale();
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
          {local(s, 'name')}
        </span>
      ))}
    </div>
  );
}

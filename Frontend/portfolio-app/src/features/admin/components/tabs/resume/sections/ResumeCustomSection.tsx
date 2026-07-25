import type { ResumeSettings } from '../../../../types/resume';

interface Props {
  title: string;
  content: string;
  settings: ResumeSettings;
}

export default function ResumeCustomSection({ title, content, settings }: Props) {
  const { colors, fonts } = settings;
  return (
    <p style={{
      fontSize: fonts.bodySize,
      lineHeight: fonts.bodyLineHeight,
      color: colors.primaryText,
      fontFamily: fonts.fontFamily,
      whiteSpace: 'pre-wrap',
    }}>{content}</p>
  );
}

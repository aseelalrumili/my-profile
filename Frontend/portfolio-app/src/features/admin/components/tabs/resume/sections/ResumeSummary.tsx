import type { ResumeSettings } from '../../../../types/resume';

interface Props {
  text: string;
  settings: ResumeSettings;
}

export default function ResumeSummary({ text, settings }: Props) {
  const { colors, fonts } = settings;
  return (
    <p style={{
      fontSize: fonts.bodySize,
      lineHeight: fonts.bodyLineHeight,
      color: colors.primaryText,
      fontFamily: fonts.fontFamily,
    }}>{text}</p>
  );
}

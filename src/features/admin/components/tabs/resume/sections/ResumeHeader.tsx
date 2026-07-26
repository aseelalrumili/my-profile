import type { ResumeSettings } from '@/core/types/resume';
import type { Profile } from '@/core/types/profile';
import { useLocale } from '@/shared/hooks/useLocale';

interface Props {
  profile: Profile;
  settings: ResumeSettings;
}

export default function ResumeHeader({ profile, settings }: Props) {
  const { local } = useLocale();
  const { layout, colors, fonts } = settings;
  const name = local(profile, 'fullName');
  const title = local(profile, 'jobTitle');
  const location = local(profile, 'location');

  const photoRadius =
    layout.photoShape === 'circle' ? '50%' :
    layout.photoShape === 'rounded' ? '12px' : '0';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
      {layout.showPhoto && profile.photoUrl && (
        <img
          src={profile.photoUrl}
          alt={name}
          style={{
            width: layout.photoSize,
            height: layout.photoSize,
            objectFit: 'cover',
            borderRadius: photoRadius,
            flexShrink: 0,
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: fonts.titleSize,
          fontWeight: fonts.titleWeight,
          color: colors.headingText,
          fontFamily: fonts.fontFamily,
          marginBottom: 2,
          lineHeight: 1.2,
        }}>{name}</h1>
        <p style={{
          fontSize: fonts.metaSize + 1,
          color: colors.accent,
          fontFamily: fonts.fontFamily,
          marginBottom: 6,
        }}>{title}</p>
        <div style={{
          fontSize: fonts.metaSize,
          color: colors.secondaryText,
          fontFamily: fonts.fontFamily,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {location && <span>{location}</span>}
        </div>
      </div>
    </div>
  );
}

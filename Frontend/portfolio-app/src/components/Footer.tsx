import { useTranslation } from 'react-i18next';
import { FaLinkedinIn, FaGithub, FaTwitter, FaInstagram, FaBehance, FaDribbble } from 'react-icons/fa';
import type { AppData } from '../types';

const allSocialIcons: Record<string, React.ReactNode> = {
  linkedin: <FaLinkedinIn />,
  github: <FaGithub />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  behance: <FaBehance />,
  dribbble: <FaDribbble />,
};

export default function Footer({ data }: { data: AppData }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h3>ASIL</h3>
          <p>
            {isAr && data.profile.bioAr ? data.profile.bioAr : (data.profile.bio || t('hero.bio'))}
          </p>
        </div>

        <div className="footer-links-col">
          <h4>{isAr ? 'تواصل معي' : 'Connect'}</h4>
          <div className="footer-social">
            {data.socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                {allSocialIcons[link.platform.toLowerCase()] || link.platform.charAt(0)}
              </a>
            ))}
          </div>
          {data.profile.phone && (
            <a
              href={`https://wa.me/${data.profile.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ marginTop: 'var(--space-3)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--fs-xs)' }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {isAr && data.profile.fullNameAr ? data.profile.fullNameAr : data.profile.fullName || 'Portfolio'}. {t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

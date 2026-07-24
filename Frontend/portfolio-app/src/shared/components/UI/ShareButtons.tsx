import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiLink } from 'react-icons/fi';

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const { t } = useTranslation();

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success(t('projects.copied'));
  };

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="share-buttons">
      <a className="share-btn" href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a>
      <a className="share-btn" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <button className="share-btn" onClick={copyLink}><FiLink /> {t('projects.copyLink')}</button>
    </div>
  );
}

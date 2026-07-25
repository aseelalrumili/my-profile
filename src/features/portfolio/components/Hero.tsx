import { useRef, useState, useCallback, useEffect, useMemo, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import { FaLinkedinIn, FaGithub, FaTwitter, FaInstagram, FaBehance, FaDribbble, FaGlobe } from 'react-icons/fa';
import type { AppData } from '../../../types';
import { useCountUp } from '../../../shared/hooks/useCountUp';
import { useLocale } from '../../../shared/hooks/useLocale';
import LazyImage from '../../../shared/components/UI/LazyImage';
import HeroFloatingShapes from './HeroFloatingShapes';

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <FaLinkedinIn />,
  github: <FaGithub />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  behance: <FaBehance />,
  dribbble: <FaDribbble />,
  website: <FaGlobe />,
};

function StatCounter({ value, label }: { value: number; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <motion.div
      className="hero-stat"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="number">{count}+</div>
      <div className="label">{label}</div>
    </motion.div>
  );
}

function Hero({ data }: { data: AppData }) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();
  const { profile, socialLinks } = data;
  const photoRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const getName = () => local(profile, 'fullName') || profile.fullName;
  const getJobTitle = () => local(profile, 'jobTitle') || profile.jobTitle;

  const nameParts = useMemo(() => {
    const name = getName() || 'Your Name';
    const parts = name.split(' ');
    return { first: parts[0] || '', rest: parts.slice(1).join(' ') };
  }, [isAr, profile.fullName, profile.fullNameAr]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (profile.heroEffect === 'Parallax') {
      setTransform(`translate(${x * 15}px, ${y * 15}px) scale(1.02)`);
    } else if (profile.heroEffect === '3DPlane') {
      setTransform(`perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`);
    }
  }, [profile.heroEffect]);

  const handleMouseLeave = useCallback(() => setTransform(''), []);

  const filteredSocial = socialLinks || [];

  return (
    <section className="hero-section" ref={sectionRef}>
      <div className="hero-gradient-bg" />

      <HeroFloatingShapes />

      <motion.div className="hero-content" style={{ y: parallaxY }}>
        <div className="hero-text">
          <motion.div
            className="hero-greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('hero.greeting')}
          </motion.div>

          <h1 className="hero-title">
            <motion.span
              className="hero-name-first"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {nameParts.first}
            </motion.span>
            {nameParts.rest && (
              <motion.span
                className="hero-name-rest"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                {' '}{nameParts.rest}
              </motion.span>
            )}
          </h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
              {getJobTitle()}
            </span>
          </motion.p>

          <motion.p
            className="hero-bio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            {local(profile, 'bio') || t('hero.bio')}
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <a href="#projects" className="btn btn-primary hero-btn-glow">
              {t('hero.viewWork')} <FiArrowRight />
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <FiDownload /> {t('hero.downloadCv')}
              </a>
            )}
          </motion.div>

          <motion.div
            className="hero-social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95 }}
          >
            {filteredSocial.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                {socialIcons[link.platform.toLowerCase()] || link.platform.charAt(0)}
              </a>
            ))}
          </motion.div>

          <div className="hero-stats">
            {profile.statsProjects > 0 && (
              <StatCounter value={profile.statsProjects} label={t('hero.stats.projects')} />
            )}
            {profile.statsExperience > 0 && (
              <StatCounter value={profile.statsExperience} label={t('hero.stats.experience')} />
            )}
            {profile.statsClients > 0 && (
              <StatCounter value={profile.statsClients} label={t('hero.stats.clients')} />
            )}
            {profile.statsAwards > 0 && (
              <StatCounter value={profile.statsAwards} label={t('hero.stats.awards')} />
            )}
          </div>
        </div>

        <motion.div
          className="hero-photo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          <div
            ref={photoRef}
            className="hero-photo-wrapper"
            style={{ transform: transform || undefined, transition: 'transform 0.15s ease-out' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {profile.photoUrl ? (
              <LazyImage src={profile.photoUrl} alt={getName()} className="hero-photo-img" />
            ) : (
              <div className="hero-photo-placeholder">
                {(getName() || 'YN').charAt(0)}
              </div>
            )}
          </div>
          <div className="hero-photo-ring" />
        </motion.div>
      </motion.div>

    </section>
  );
}

export default memo(Hero);

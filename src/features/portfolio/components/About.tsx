import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiUser } from 'react-icons/fi';
import type { AppData } from '../../../types';
import { useCountUp } from '../../../shared/hooks/useCountUp';
import { useLocale } from '../../../shared/hooks/useLocale';
import SectionHeader from '../../../shared/components/UI/SectionHeader';

function AboutStatCard({ value, label }: { value: number; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <motion.div
      className="about-stat-card"
      ref={ref}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(201, 168, 76, 0.15)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="about-stat-number">{count}+</div>
      <div className="about-stat-label">{label}</div>
    </motion.div>
  );
}

export default function About({ data }: { data: AppData }) {
  const { t } = useTranslation();
  const { profile, education = [] } = data;
  const { isAr, local } = useLocale();
  const getBio = () => local(profile, 'bio');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="section">
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader title={t('about.title')} subtitle={t('about.subtitle')} underline icon={<FiUser />} />
      </motion.div>

      <div className="about-content">
        <motion.div
          className="about-text-col"
          initial={{ opacity: 0, x: isAr ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="about-bio">
            {getBio() || 'A passionate graphic designer crafting beautiful visual identities and digital experiences.'}
          </p>

          <motion.div
            className="about-info-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {profile.email && (
              <motion.div className="about-info-item" variants={itemVariants}>
                <span className="about-info-label">{t('about.email')}</span>
                <p className="about-info-value">{profile.email}</p>
              </motion.div>
            )}
            {profile.location && (
              <motion.div className="about-info-item" variants={itemVariants}>
                <span className="about-info-label">{t('about.location')}</span>
                <p className="about-info-value">{local(profile, 'location')}</p>
              </motion.div>
            )}
            {profile.phone && (
              <motion.div className="about-info-item" variants={itemVariants}>
                <span className="about-info-label">{t('about.phone')}</span>
                <p className="about-info-value">{profile.phone}</p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="about-education"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="about-subtitle">{t('about.education') || 'Education'}</h3>
            <div className="about-timeline">
              {education.map((edu, idx) => (
                <motion.div
                  key={edu.id}
                  className="about-timeline-item"
                  initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                >
                  <div className="about-timeline-dot" />
                  <div className="about-timeline-content">
                    <span className="about-timeline-period">{edu.period}</span>
                    <h4>{local(edu, 'degree')}</h4>
                    <p>{local(edu, 'institution')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="about-stats-col"
          initial={{ opacity: 0, x: isAr ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="about-stats-grid">
            {profile.statsProjects > 0 && (
              <AboutStatCard value={profile.statsProjects} label={t('hero.stats.projects')} />
            )}
            {profile.statsExperience > 0 && (
              <AboutStatCard value={profile.statsExperience} label={t('hero.stats.experience')} />
            )}
            {profile.statsClients > 0 && (
              <AboutStatCard value={profile.statsClients} label={t('hero.stats.clients')} />
            )}
            {profile.statsAwards > 0 && (
              <AboutStatCard value={profile.statsAwards} label={t('hero.stats.awards')} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

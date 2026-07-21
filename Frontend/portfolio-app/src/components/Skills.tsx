import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { AppData, Skill } from '../types';

function SkillColumn({ title, skills, isAr, containerVariants, cardVariants }: {
  title: string; skills: Skill[]; isAr: boolean;
  containerVariants: any; cardVariants: any;
}) {
  if (skills.length === 0) return null;
  return (
    <motion.div
      className="skills-column"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="skills-column-title">{title}</h3>
      <motion.div
        className="skills-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            className="skill-card"
            variants={cardVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <div className="skill-header">
              <span className="skill-name">{isAr && skill.nameAr ? skill.nameAr : skill.name}</span>
              <span className="skill-pct">{skill.percentage}%</span>
            </div>
            <div className="skill-bar">
              <motion.div
                className="skill-bar-fill"
                initial={{ width: '0%' }}
                whileInView={{ width: `${skill.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function Skills({ data }: { data: AppData }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const designSkills = useMemo(() =>
    data.skills.filter(s => s.type === 'Development' ? false : true),
    [data.skills]
  );
  const devSkills = useMemo(() =>
    data.skills.filter(s => s.type === 'Development'),
    [data.skills]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('skills.title')}
        <span className="section-title-underline" />
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('skills.subtitle')}
      </motion.p>

      <div className="skills-split">
        <SkillColumn title={t('skills.designTools')} skills={designSkills} isAr={isAr} containerVariants={containerVariants} cardVariants={cardVariants} />
        <SkillColumn title={t('skills.devTech')} skills={devSkills} isAr={isAr} containerVariants={containerVariants} cardVariants={cardVariants} />
      </div>
    </section>
  );
}

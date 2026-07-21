import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { AppData } from '../types';

export default function Experience({ data }: { data: AppData }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section className="section">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {t('experience.title')}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t('experience.subtitle')}
      </motion.p>

      <div className="timeline">
        {data.experience.map((exp, idx) => (
          <motion.div
            key={exp.id}
            className="timeline-item"
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="period">{exp.period}</div>
            <h3>{isAr && exp.titleAr ? exp.titleAr : exp.title}</h3>
            {exp.company && <div className="company">{isAr && exp.companyAr ? exp.companyAr : exp.company}</div>}
            {exp.description && <p className="desc">{isAr && exp.descriptionAr ? exp.descriptionAr : exp.description}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiBriefcase } from 'react-icons/fi';
import type { AppData } from '../../../types';
import { useLocale } from '../../../shared/hooks/useLocale';
import SectionHeader from '../../../shared/components/UI/SectionHeader';

export default function Experience({ data }: { data: AppData }) {
  const { t } = useTranslation();
  const { isAr, local } = useLocale();

  return (
    <section className="section">
      <SectionHeader title={t('experience.title')} subtitle={t('experience.subtitle')} icon={<FiBriefcase />} />

      <div className="timeline">
        {(data.experience || []).map((exp, idx) => (
          <motion.div
            key={exp.id}
            className="timeline-item"
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="period">{exp.period}</div>
            <h3>{local(exp, 'title')}</h3>
            {exp.company && <div className="company">{local(exp, 'company')}</div>}
            {exp.description && <p className="desc">{local(exp, 'description')}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

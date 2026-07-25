import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Page404() {
  const { t } = useTranslation();

  return (
    <div className="page-404">
      <motion.div
        className="code"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        {t('notFound.title')}
      </motion.div>
      <motion.div
        className="subtitle"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('notFound.subtitle')}
      </motion.div>
      <motion.p
        className="message"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t('notFound.message')}
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/" className="btn btn-primary" style={{ width: 'auto', display: 'inline-block', textDecoration: 'none' }}>
          {t('notFound.goHome')}
        </Link>
      </motion.div>
    </div>
  );
}

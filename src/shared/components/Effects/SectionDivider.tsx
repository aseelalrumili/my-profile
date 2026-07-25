import { motion } from 'framer-motion';

interface Props {
  style?: 'line' | 'dots' | 'none';
}

export default function SectionDivider({ style = 'line' }: Props) {
  if (style === 'none') return null;

  if (style === 'dots') {
    return (
      <div className="section-divider section-divider-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <motion.div
      className="section-divider"
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

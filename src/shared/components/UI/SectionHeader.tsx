import { type ReactNode } from 'react';
import { motion, type Target } from 'framer-motion';

interface Props {
  title: string;
  subtitle: string;
  animate?: boolean;
  underline?: boolean;
  icon?: ReactNode;
}

export default function SectionHeader({ title, subtitle, animate, underline, icon }: Props) {
  const initial: Target = { opacity: 0, y: 30 };
  const visible: Target = { opacity: 1, y: 0 };
  const trigger = animate ? { animate: visible } : { whileInView: visible };

  return (
    <>
      <motion.h2
        className="section-title"
        initial={initial}
        {...trigger}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {icon && <span className="section-title-icon">{icon}</span>}
        {title}
        {underline && <span className="section-title-underline" />}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        initial={{ opacity: 0, y: 20 }}
        {...trigger}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {subtitle}
      </motion.p>
    </>
  );
}

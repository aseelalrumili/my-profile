import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pageVariants = {
  initial: { opacity: 0, y: prefersReduced ? 0 : 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: prefersReduced ? 0 : -20 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut',
  duration: prefersReduced ? 0 : 0.3,
};

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

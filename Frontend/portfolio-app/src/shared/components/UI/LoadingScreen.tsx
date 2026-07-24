import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const shapes = [
  { rotate: 0, delay: 0 },
  { rotate: 60, delay: 0.15 },
  { rotate: 120, delay: 0.3 },
];

const hexPath =
  'M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z';

export default function LoadingScreen() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const loadingText = isAr ? 'جاري التحميل...' : 'Loading...';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          background: 'var(--bg, #1a2744)',
        }}
      >
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          {shapes.map((s, i) => (
            <motion.svg
              key={i}
              viewBox="-35 -35 70 70"
              width={80}
              height={80}
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1, 1, 0.4],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path d={hexPath} fill="none" stroke="var(--accent, #c9a84c)" strokeWidth={2.5} />
            </motion.svg>
          ))}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: 'var(--accent, #c9a84c)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ color: 'var(--accent, #c9a84c)', fontSize: 14, fontFamily: 'var(--font-body)', letterSpacing: 3 }}
        >
          {loadingText}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          style={{
            height: 3,
            width: 160,
            borderRadius: 2,
            background: 'linear-gradient(90deg, var(--accent, #c9a84c), #e8c84a, var(--accent, #c9a84c))',
            transformOrigin: 'left center',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

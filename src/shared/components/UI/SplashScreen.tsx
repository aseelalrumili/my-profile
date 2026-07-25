import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onComplete: () => void;
}

const SPLASH_KEY = 'splash_seen';

export default function SplashScreen({ onComplete }: Props) {
  const [isVisible, setIsVisible] = useState(() => !sessionStorage.getItem(SPLASH_KEY));
  const isAr = document.documentElement.lang === 'ar';
  const name = isAr ? 'أصيل' : 'ASIL';

  useEffect(() => {
    if (!isVisible) { onComplete(); return; }
    const timer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, '1');
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 2200);
    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  const letters = name.split('');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="splash-content">
            {/* Decorative lines */}
            <motion.div
              className="splash-line splash-line-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Name letters */}
            <div className="splash-name">
              {letters.map((letter, i) => (
                <motion.span
                  key={i}
                  className="splash-letter"
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Decorative lines */}
            <motion.div
              className="splash-line splash-line-right"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Subtitle */}
            <motion.p
              className="splash-subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              {isAr ? 'مصمم جرافيك ومدير إبداعي' : 'Graphic Designer & Creative Director'}
            </motion.p>

            {/* Accent dot */}
            <motion.div
              className="splash-dot"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: 0.5, delay: 1.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

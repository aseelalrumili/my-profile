import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { getUploadUrl, getCachedImage } from '../api/client';

interface Props {
  imageUrl: string;
  alt?: string;
  onClose: () => void;
}

export default function Lightbox({ imageUrl, alt = 'Lightbox image', onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button className="lightbox-close" ref={closeRef} onClick={onClose} aria-label="Close lightbox">&times;</button>
        <motion.img
          src={getCachedImage(getUploadUrl(imageUrl)) || getUploadUrl(imageUrl)}
          alt={alt}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}

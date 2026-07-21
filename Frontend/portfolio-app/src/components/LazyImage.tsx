import { useState, useRef, useEffect } from 'react';
import { getUploadUrl } from '../api/client';

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function LazyImage({ src, alt, className, style, onClick }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const resolvedSrc = getUploadUrl(src);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`lazy-image-wrapper ${className || ''}`} style={style} onClick={onClick}>
      {inView ? (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`lazy-image ${loaded ? 'loaded' : ''}`}
        />
      ) : (
        <div className="lazy-image-placeholder" />
      )}
    </div>
  );
}

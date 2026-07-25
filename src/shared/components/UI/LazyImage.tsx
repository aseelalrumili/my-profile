import { useState, useRef, useEffect } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function LazyImage({ src, alt, className, style, onClick }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const resolvedSrc = src;

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`lazy-image-wrapper ${className || ''}`} style={style} onClick={onClick}>
      {isInView ? (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
        />
      ) : (
        <div className="lazy-image-placeholder" />
      )}
    </div>
  );
}

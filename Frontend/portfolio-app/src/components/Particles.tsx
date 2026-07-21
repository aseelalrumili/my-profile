import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      container.appendChild(p);
      particles.push(p);
    }

    let animId: number;
    const animate = () => {
      particles.forEach((p) => {
        const y = parseFloat(p.style.top) || 0;
        p.style.top = `${y - 0.015}%`;
        if (parseFloat(p.style.top) < -2) p.style.top = '102%';
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      particles.forEach((p) => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="particles-container" aria-hidden="true" />;
}

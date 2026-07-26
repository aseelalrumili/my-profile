import { motion } from 'framer-motion';

const floatingShapes = [
  { size: 80, x: '10%', y: '15%', delay: 0, type: 'circle' as const },
  { size: 50, x: '85%', y: '20%', delay: 1.5, type: 'diamond' as const },
  { size: 35, x: '75%', y: '70%', delay: 0.8, type: 'circle' as const },
  { size: 60, x: '15%', y: '75%', delay: 2, type: 'diamond' as const },
  { size: 25, x: '50%', y: '10%', delay: 1.2, type: 'circle' as const },
  { size: 45, x: '90%', y: '50%', delay: 0.5, type: 'diamond' as const },
];

export default function HeroFloatingShapes() {
  return (
    <div aria-hidden="true">
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`floating-shape floating-shape-${shape.type}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: shape.type === 'diamond' ? [45, 55, 45] : [0, 360],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

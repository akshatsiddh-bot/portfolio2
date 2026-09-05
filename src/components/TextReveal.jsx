import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';

/**
 * Deterministic pseudo-random: same index always produces same value.
 * Uses a simple hash to avoid Math.random() non-determinism.
 */
function seededRandom(index, seed = 0) {
  const x = Math.sin((index + 1) * 9301 + seed * 49297) * 49297;
  return x - Math.floor(x);
}

const modes = {
  'slide-up': {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  cascade: {
    hidden: { y: 12, opacity: 0, rotate: -1 },
    visible: { y: 0, opacity: 1, rotate: 0 },
  },
  burst: {
    hidden: (i) => ({
      x: Math.sin(i * 2.7) * 12,
      y: 10 + Math.cos(i * 1.9) * 8,
      opacity: 0,
    }),
    visible: { x: 0, y: 0, opacity: 1 },
  },
  /**
   * Scatter mode — controlled chaos → order.
   * Words start at deterministic random positions and settle into place.
   * Positions are seeded by word index so the same text always scatters identically.
   */
  scatter: {
    hidden: (i) => ({
      x: (seededRandom(i, 1) - 0.5) * 60,
      y: (seededRandom(i, 2) - 0.5) * 40 + 15,
      rotate: (seededRandom(i, 3) - 0.5) * 6,
      scale: 0.92 + seededRandom(i, 4) * 0.16,
      opacity: 0,
    }),
    visible: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  },
};

export default function TextReveal({
  text,
  tag: Tag = 'p',
  className = '',
  delay = 0,
  mode = 'slide-up',
  staggerChildren = 0.03,
}) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();

  const words = text.split(' ');
  const modeConfig = modes[mode] || modes['slide-up'];

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  // Scatter mode uses a longer, spring-like settle for the "chaos → order" feel
  const isScatter = mode === 'scatter';

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <motion.span
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}
        initial="hidden"
        animate={hasBeenInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: isScatter ? 0.02 : staggerChildren,
              delayChildren: delay,
            },
          },
        }}
      >
        {words.map((word, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={{
                hidden:
                  typeof modeConfig.hidden === 'function'
                    ? modeConfig.hidden(i)
                    : modeConfig.hidden,
                visible: {
                  ...modeConfig.visible,
                  transition: isScatter
                    ? {
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        // All words settle roughly together regardless of stagger start
                        delay: seededRandom(i, 5) * 0.15,
                      }
                    : {
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                },
              }}
              aria-hidden="true"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

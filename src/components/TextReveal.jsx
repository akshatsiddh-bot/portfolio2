import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';

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
      x: (Math.sin(i * 2.7) * 12),
      y: 10 + Math.cos(i * 1.9) * 8,
      opacity: 0,
    }),
    visible: { x: 0, y: 0, opacity: 1 },
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

  // Reduced motion: render immediately
  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

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
              staggerChildren,
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
                  transition: {
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

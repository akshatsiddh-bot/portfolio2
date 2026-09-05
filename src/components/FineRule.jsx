import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';

export default function FineRule({ direction = 'horizontal', className = '', animate = true, delay = 0 }) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const isHorizontal = direction === 'horizontal';
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        backgroundColor: 'var(--line)',
        ...(isHorizontal
          ? { height: '1px', width: '100%' }
          : { width: '1px', height: '100%' }),
        transformOrigin: isHorizontal ? 'left center' : 'center top',
      }}
      initial={shouldAnimate ? { scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 } : false}
      animate={
        shouldAnimate
          ? hasBeenInView
            ? { scaleX: 1, scaleY: 1 }
            : { scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }
          : { scaleX: 1, scaleY: 1 }
      }
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      aria-hidden="true"
    />
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../systems/useReducedMotion';

/*
 * CustomCursor — one translucent, blurred, background-aware cursor.
 * No trail. No particles. No ghosts.
 *
 * Uses backdrop-filter for frosted glass effect.
 * Colors derive from CSS custom properties (--accent-current, --bg-current).
 * Disabled on touch devices and reduced motion.
 */

const CURSOR_SIZES = {
  default: 14,
  link: 22,
  project: 44,
  copy: 44,
};

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [variant, setVariant] = useState('default');
  const [label, setLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Detect touch device
  const isTouch = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const updatePosition = useCallback(() => {
    const lerp = 0.15;
    posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
    posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

    if (cursorRef.current) {
      cursorRef.current.style.transform =
        `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
    }

    rafRef.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    if (isTouch || prefersReducedMotion) return;

    const onMouseMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Detect cursor state from data-cursor attributes
    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const cursorType = target.getAttribute('data-cursor');
        setVariant(cursorType || 'default');
        setLabel(target.getAttribute('data-cursor-label') || '');
      } else if (e.target.closest('a, button, [role="button"]')) {
        setVariant('link');
        setLabel('');
      } else {
        setVariant('default');
        setLabel('');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, prefersReducedMotion, isVisible, updatePosition]);

  // Don't render on touch or reduced motion
  if (isTouch || prefersReducedMotion) return null;

  const size = CURSOR_SIZES[variant] || CURSOR_SIZES.default;
  const hasLabel = variant === 'project' || variant === 'copy';

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        zIndex: 99999,
        willChange: 'transform',
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          opacity: isVisible ? 1 : 0,
          x: -size / 2,
          y: -size / 2,
        }}
        transition={{
          width: { type: 'spring', stiffness: 400, damping: 28 },
          height: { type: 'spring', stiffness: 400, damping: 28 },
          opacity: { duration: 0.2 },
        }}
        style={{
          borderRadius: hasLabel ? '4px' : '50%',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'color-mix(in srgb, var(--accent-current) 10%, var(--bg-current) 20%)',
          border: '1px solid color-mix(in srgb, var(--accent-current) 22%, transparent)',
          boxShadow: '0 1px 4px color-mix(in srgb, var(--accent-current) 8%, transparent)',
        }}
        className="flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {hasLabel && (
            <motion.span
              key={label || variant}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              style={{
                fontSize: '8px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              {label || (variant === 'project' ? 'VIEW' : 'COPY')}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

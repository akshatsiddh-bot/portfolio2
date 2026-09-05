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
      <AnimatePresence mode="wait">
        {hasLabel ? (
          /* Glass card for VIEW / COPY / COPIED */
          <motion.div
            key="label-cursor"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: isVisible ? 1 : 0,
              width: 52,
              height: 52,
              x: -26,
              y: -26,
            }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 30,
            }}
            style={{
              borderRadius: '6px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor:
                'color-mix(in srgb, var(--accent-current) 14%, var(--bg-current) 22%)',
              border:
                '1px solid color-mix(in srgb, var(--accent-current) 26%, transparent)',
              boxShadow:
                '0 2px 8px color-mix(in srgb, var(--accent-current) 10%, transparent)',
            }}
            className="flex items-center justify-center"
          >
            <span
              style={{
                fontSize: '8.5px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              {label || (variant === 'project' ? 'VIEW' : 'COPY')}
            </span>
          </motion.div>
        ) : (
          /* Pointing arrow cursor shape */
          <motion.div
            key="arrow-cursor"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              scale: variant === 'link' ? 1.18 : 1,
              x: 0,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              scale: { type: 'spring', stiffness: 450, damping: 28 },
              opacity: { duration: 0.15 },
            }}
            style={{
              filter:
                'drop-shadow(0 2px 5px color-mix(in srgb, var(--accent-current) 20%, rgba(0,0,0,0.12)))',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: 'block',
                transform: 'translate(-2px, -2px)',
              }}
            >
              {/* Pointing arrow geometry with tip at (2.5, 1.5) */}
              <path
                d="M 2.5 1.5 L 2.5 19 L 7.2 14.3 L 11.2 22.2 L 13.8 20.8 L 9.8 13 L 17 13 Z"
                fill="color-mix(in srgb, var(--accent-current) 18%, var(--bg-current) 35%)"
                stroke="color-mix(in srgb, var(--accent-current) 75%, var(--text-primary) 25%)"
                strokeWidth="1.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  backdropFilter: 'blur(8px)',
                }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

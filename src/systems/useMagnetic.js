import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Magnetic interaction hook — subtly translates an element toward the cursor
 * when the cursor is within a proximity radius.
 *
 * @param {React.RefObject} ref - Element ref
 * @param {Object} options - { strength: 0-1, radius: px }
 * @returns {{ x: number, y: number }} Current magnetic offset
 */
export function useMagnetic(ref, options = {}) {
  const { strength = 0.3, radius = 100 } = options;
  const prefersReducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isTouch =
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current || prefersReducedMotion || isTouch) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        const pull = (1 - distance / radius) * strength;
        setOffset({ x: distX * pull, y: distY * pull });
      } else {
        setOffset((prev) => {
          if (Math.abs(prev.x) < 0.5 && Math.abs(prev.y) < 0.5) return { x: 0, y: 0 };
          return { x: prev.x * 0.9, y: prev.y * 0.9 };
        });
      }
    },
    [ref, strength, radius, prefersReducedMotion, isTouch]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isTouch) return;

    window.addEventListener('mousemove', handleMouseMove);
    const element = ref.current;
    if (element) {
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (element) {
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseMove, handleMouseLeave, ref, prefersReducedMotion, isTouch]);

  return offset;
}

import { useState, useEffect, useCallback } from 'react';

/**
 * Intersection observer hook for triggering entrance animations.
 * @param {React.RefObject} ref - Element ref to observe
 * @param {Object} options - { threshold, rootMargin }
 * @returns {{ isInView: boolean, hasBeenInView: boolean }}
 */
export function useInView(ref, options = {}) {
  const { threshold = 0.2, rootMargin = '0px' } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    setIsInView(entry.isIntersecting);
    if (entry.isIntersecting) {
      setHasBeenInView(true);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, handleIntersection]);

  return { isInView, hasBeenInView };
}

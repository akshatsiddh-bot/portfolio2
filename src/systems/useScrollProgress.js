import { useState, useEffect, useCallback } from 'react';

/**
 * Tracks overall scroll progress and active section index.
 * Sections register via [data-section] attributes in the DOM.
 * @returns {{ progress: number, activeSection: number }}
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    setProgress(scrollProgress);

    // Determine active section by finding which section occupies the most viewport
    const sections = document.querySelectorAll('[data-section]');
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveSection(closestIndex);
  }, []);

  useEffect(() => {
    let rafId = null;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return { progress, activeSection };
}

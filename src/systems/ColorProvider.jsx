import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ColorContext = createContext({
  progress: 0,
  activeSection: 0,
  accentColor: '#C4A68A',
});

const BG_STOPS = ['#F5F0EB', '#F0E8E2', '#EBE0DA', '#E5D5CC', '#F2ECE7'];
const ACCENT_STOPS = ['#C4A68A', '#B8877A', '#A86E62', '#9B5B50', '#8B6B5E'];

/** Linearly interpolate between two hex colors */
function lerpColor(a, b, t) {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);

  const ar = (ah >> 16) & 0xff;
  const ag = (ah >> 8) & 0xff;
  const ab = ah & 0xff;

  const br = (bh >> 16) & 0xff;
  const bg = (bh >> 8) & 0xff;
  const bb = bh & 0xff;

  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);

  return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, '0')}`;
}

/** Get interpolated color from an array of stops based on 0-1 progress */
function getColorAtProgress(stops, progress) {
  const clamped = Math.max(0, Math.min(1, progress));
  const segment = clamped * (stops.length - 1);
  const index = Math.floor(segment);
  const t = segment - index;

  if (index >= stops.length - 1) return stops[stops.length - 1];
  return lerpColor(stops[index], stops[index + 1], t);
}

export function ColorProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [accentColor, setAccentColor] = useState(ACCENT_STOPS[0]);

  const updateColors = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    setProgress(scrollProgress);

    // Determine active section
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

    // Update CSS custom properties for smooth color transitions
    const bg = getColorAtProgress(BG_STOPS, scrollProgress);
    const accent = getColorAtProgress(ACCENT_STOPS, scrollProgress);
    setAccentColor(accent);

    document.documentElement.style.setProperty('--bg-current', bg);
    document.documentElement.style.setProperty('--accent-current', accent);
  }, []);

  useEffect(() => {
    let rafId = null;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateColors();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateColors(); // Initial

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateColors]);

  return (
    <ColorContext.Provider value={{ progress, activeSection, accentColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  return useContext(ColorContext);
}

import { AnimatePresence, motion } from 'framer-motion';
import { useColor } from '../systems/ColorProvider';

const SECTION_NAMES = ['HERO', 'ABOUT', 'SKILLS', 'PROJECTS', 'EXPERIENCE', 'CONTACT'];
const TOTAL = SECTION_NAMES.length;

export default function SectionProgress() {
  const { activeSection } = useColor();
  const num = String(activeSection + 1).padStart(2, '0');

  return (
    <div
      className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-3"
      aria-hidden="true"
    >
      <div className="flex items-baseline gap-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={num}
            className="text-meta-accent font-mono tabular-nums"
            style={{ fontSize: '0.75rem' }}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {num}
          </motion.span>
        </AnimatePresence>
        <span className="text-meta font-mono" style={{ fontSize: '0.65rem' }}>
          / {String(TOTAL).padStart(2, '0')}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.span
          key={SECTION_NAMES[activeSection]}
          className="text-meta"
          style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}
          initial={{ opacity: 0, x: -8, width: 0 }}
          animate={{ opacity: 1, x: 0, width: 'auto' }}
          exit={{ opacity: 0, x: 8, width: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {SECTION_NAMES[activeSection]}
        </motion.span>
      </AnimatePresence>

      <div className="flex gap-1.5 ml-2">
        {SECTION_NAMES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === activeSection ? '16px' : '4px',
              height: '4px',
              backgroundColor:
                i === activeSection ? 'var(--accent-current)' : 'var(--line)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

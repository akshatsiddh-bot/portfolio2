import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';
import SectionWrapper from '../components/SectionWrapper';
import MetadataLabel from '../components/MetadataLabel';
import FineRule from '../components/FineRule';
import { timeline } from '../data/timeline';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   EXPERIENCE
   05 / 06
   Timeline of roles, contributions, and practical experience.
   The timeline spine grows as the user scrolls, with entries
   revealing progressively.
   ────────────────────────────────────────────── */

function TimelineEntry({ entry, index, isLast }) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-start gap-6 md:gap-10">
      {/* Timeline connector */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: '60px' }}>
        {/* Year marker */}
        <motion.span
          className="font-mono text-xs tabular-nums font-medium"
          style={{ color: 'var(--accent-current)' }}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {entry.year}
        </motion.span>
        {/* Node */}
        <motion.div
          className="my-2 rounded-full"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-current)',
          }}
          initial={prefersReducedMotion ? false : { scale: 0 }}
          animate={hasBeenInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.15, type: 'spring', stiffness: 300 }}
        />
        {/* Vertical line segment extending to next entry */}
        {!isLast && (
          <motion.div
            style={{
              width: '1px',
              height: '56px',
              backgroundColor: 'var(--line)',
              transformOrigin: 'top',
            }}
            initial={prefersReducedMotion ? false : { scaleY: 0 }}
            animate={hasBeenInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          />
        )}
      </div>

      {/* Entry content */}
      <motion.div
        className="flex-1 pb-12"
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, x: isEven ? -24 : 24 }
        }
        animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h3
          className="font-display text-lg md:text-xl mb-1.5"
          style={{ color: 'var(--text-primary)' }}
        >
          {entry.role}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {entry.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const spineRef = useRef(null);
  const { hasBeenInView } = useInView(sectionRef, { threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Scroll-driven spine growth — the vertical line extends as user scrolls through */
  useEffect(() => {
    if (prefersReducedMotion || isMobile || !spineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMobile]);

  return (
    <SectionWrapper id="experience" label="Experience" className="relative">
      <div ref={sectionRef} className="max-w-3xl mx-auto">
        {/* Section indicator */}
        <motion.div
          className="mb-16"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <MetadataLabel>05 / 06 — Experience</MetadataLabel>
        </motion.div>

        {/* Section heading */}
        <motion.h2
          className="text-display mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Work & experience.
        </motion.h2>
        <motion.p
          className="text-sm leading-relaxed max-w-xl mb-16"
          style={{ color: 'var(--text-secondary)' }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Practical software engineering, technical contributions, and project development milestones.
        </motion.p>

        <FineRule className="mb-12" delay={0.3} />

        {/* Timeline with spine */}
        <div className="relative">
          {/* Background spine — the continuous vertical line, scroll-driven */}
          <div
            ref={spineRef}
            className="absolute hidden md:block"
            style={{
              left: '30px',
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: 'var(--accent-current)',
              opacity: 0.15,
              transformOrigin: 'top',
            }}
            aria-hidden="true"
          />

          {/* Timeline entries */}
          {timeline.map((entry, i) => (
            <TimelineEntry
              key={`${entry.year}-${entry.role}`}
              entry={entry}
              index={i}
              isLast={i === timeline.length - 1}
            />
          ))}
        </div>

        {/* Terminal line extending toward Contact */}
        <motion.div
          className="flex justify-center mt-8"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div
            style={{
              width: '1px',
              height: '48px',
              background: `linear-gradient(to bottom, var(--accent-current), transparent)`,
              opacity: 0.3,
            }}
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

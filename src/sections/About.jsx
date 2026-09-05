import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';
import SectionWrapper from '../components/SectionWrapper';
import TextReveal from '../components/TextReveal';
import MetadataLabel from '../components/MetadataLabel';
import FineRule from '../components/FineRule';
import { personal } from '../data/personal';
import { timeline } from '../data/timeline';

/* ──────────────────────────────────────────────
   ABOUT — Information Dump
   Chaos → Composition text reveal, editorial timeline
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
        {/* Year */}
        <motion.span
          className="text-meta-accent font-mono text-xs tabular-nums"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {entry.year}
        </motion.span>
        {/* Dot */}
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
        {/* Vertical line */}
        {!isLast && (
          <motion.div
            style={{
              width: '1px',
              height: '48px',
              backgroundColor: 'var(--line)',
              transformOrigin: 'top',
            }}
            initial={prefersReducedMotion ? false : { scaleY: 0 }}
            animate={hasBeenInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 pb-10"
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, x: isEven ? -20 : 20 }
        }
        animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h3
          className="font-display text-lg md:text-xl mb-1"
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

export default function About() {
  const sectionRef = useRef(null);
  const { hasBeenInView } = useInView(sectionRef, { threshold: 0.1 });

  return (
    <SectionWrapper id="about" label="About" className="relative">
      <div ref={sectionRef} className="max-w-3xl mx-auto">
        {/* Section indicator */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <MetadataLabel>02 / 05 — About</MetadataLabel>
        </motion.div>

        {/* Heading — burst reveal for chaos → composition effect */}
        <div className="mb-12">
          <TextReveal
            text="Building modern digital experiences with clean and scalable solutions."
            tag="h2"
            className="text-display leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            mode="burst"
            staggerChildren={0.04}
          />
        </div>

        <FineRule className="mb-12" delay={0.3} />

        {/* About paragraphs — staggered slide-up */}
        <div className="space-y-6 mb-20 max-w-2xl">
          {personal.about.map((paragraph, i) => (
            <TextReveal
              key={i}
              text={paragraph}
              tag="p"
              className="text-base leading-relaxed"
              mode="slide-up"
              delay={0.15 * i + 0.2}
              staggerChildren={0.015}
            />
          ))}
        </div>

        {/* Development approach */}
        <div className="mb-20">
          <MetadataLabel className="mb-4 block">Development Approach</MetadataLabel>
          <TextReveal
            text={personal.focus}
            tag="p"
            className="text-base leading-relaxed"
            mode="cascade"
            delay={0.3}
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>

        <FineRule className="mb-16" delay={0.4} />

        {/* Timeline */}
        <div className="mb-8">
          <MetadataLabel className="mb-10 block">Timeline</MetadataLabel>
          <div>
            {timeline.map((entry, i) => (
              <TimelineEntry
                key={`${entry.year}-${entry.role}`}
                entry={entry}
                index={i}
                isLast={i === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

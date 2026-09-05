import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';
import SectionWrapper from '../components/SectionWrapper';
import TextReveal from '../components/TextReveal';
import MetadataLabel from '../components/MetadataLabel';
import FineRule from '../components/FineRule';
import { personal } from '../data/personal';

/* ──────────────────────────────────────────────
   ABOUT
   02 / 06
   Polished editorial overview with subtle,
   natural typography reveals.
   ────────────────────────────────────────────── */

export default function About() {
  const sectionRef = useRef(null);
  const trailingRef = useRef(null);
  const { hasBeenInView } = useInView(sectionRef, { threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="about" label="About" className="relative">
      <div ref={sectionRef} className="max-w-3xl mx-auto">
        {/* Section indicator */}
        <motion.div
          className="mb-16"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <MetadataLabel>02 / 06 — About</MetadataLabel>
        </motion.div>

        {/* Heading */}
        <div className="mb-12">
          <TextReveal
            text="Building modern digital experiences with clean and scalable solutions."
            tag="h2"
            className="text-display leading-tight"
            mode="slide-up"
            staggerChildren={0.02}
          />
        </div>

        <FineRule className="mb-12" delay={0.3} />

        {/* About paragraphs — clean editorial reveal */}
        <div className="space-y-6 mb-20 max-w-2xl">
          {personal.about.map((paragraph, i) => (
            <TextReveal
              key={i}
              text={paragraph}
              tag="p"
              className="text-base leading-relaxed"
              mode="slide-up"
              delay={0.08 * i + 0.1}
              staggerChildren={0.012}
            />
          ))}
        </div>

        {/* Development approach */}
        <div className="mb-16">
          <MetadataLabel className="mb-4 block">Development Approach</MetadataLabel>
          <TextReveal
            text={personal.focus}
            tag="p"
            className="text-base leading-relaxed"
            mode="cascade"
            delay={0.3}
          />
        </div>

        <FineRule className="mb-8" delay={0.4} />

        {/* Trailing visual elements — lines that extend toward Skills,
            creating visual continuity. These are structural,
            not generic decoration. */}
        <div
          ref={trailingRef}
          className="relative overflow-hidden"
          style={{ height: '80px' }}
          aria-hidden="true"
        >
          {/* Converging lines that hint at the Skills constellation structure */}
          <motion.div
            className="absolute"
            style={{
              left: '10%',
              top: '20%',
              width: '30%',
              height: '1px',
              backgroundColor: 'var(--line)',
              transformOrigin: 'left',
            }}
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            className="absolute"
            style={{
              right: '15%',
              top: '50%',
              width: '25%',
              height: '1px',
              backgroundColor: 'var(--accent-current)',
              opacity: 0.3,
              transformOrigin: 'right',
            }}
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.div
            className="absolute"
            style={{
              left: '40%',
              top: '75%',
              width: '20%',
              height: '1px',
              backgroundColor: 'var(--line)',
              transformOrigin: 'center',
            }}
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={hasBeenInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          />
          {/* Small nodes at line endpoints — precursors to the Skills constellation */}
          {[
            { left: '40%', top: '20%' },
            { left: '60%', top: '50%' },
            { left: '60%', top: '75%' },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                ...pos,
                width: '4px',
                height: '4px',
                backgroundColor: 'var(--accent-current)',
                opacity: 0.4,
              }}
              initial={prefersReducedMotion ? false : { scale: 0 }}
              animate={hasBeenInView ? { scale: 1 } : {}}
              transition={{ delay: 1.2 + i * 0.1, type: 'spring', stiffness: 200 }}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

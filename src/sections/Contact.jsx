import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';
import SectionWrapper from '../components/SectionWrapper';
import TextReveal from '../components/TextReveal';
import MetadataLabel from '../components/MetadataLabel';
import FineRule from '../components/FineRule';
import MagneticButton from '../components/MagneticButton';
import { personal } from '../data/personal';

/* ──────────────────────────────────────────────
   CONTACT — Quiet Confident Ending
   ────────────────────────────────────────────── */

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = personal.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="text-lg md:text-xl font-display transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3"
        style={{
          color: isHovered ? 'var(--accent-current)' : 'var(--text-primary)',
          borderBottom: `1px solid ${isHovered ? 'var(--accent-current)' : 'transparent'}`,
          paddingBottom: '2px',
        }}
        aria-label={`Copy email address: ${personal.email}`}
      >
        {personal.email}
      </button>

      {/* Copy / Copied indicator */}
      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.span
            key={copied ? 'copied' : 'copy'}
            className="absolute -bottom-7 left-0 text-meta"
            style={{ color: copied ? 'var(--accent-current)' : 'var(--text-tertiary)' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            {copied ? 'COPIED ✓' : 'CLICK TO COPY'}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactLink({ label, href, children }) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <MetadataLabel className="mb-2 block">{label}</MetadataLabel>
      <MagneticButton href={href} className="text-lg md:text-xl font-display">
        {children}
      </MagneticButton>
    </motion.div>
  );
}

export default function Contact() {
  const headingRef = useRef(null);
  const { hasBeenInView } = useInView(headingRef, { threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="contact" label="Contact" className="relative">
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ minHeight: '80vh' }}
      >
        {/* Section indicator */}
        <motion.div
          className="mb-16 self-start"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <MetadataLabel>05 / 05 — Contact</MetadataLabel>
        </motion.div>

        {/* Heading */}
        <div ref={headingRef} className="mb-6">
          <TextReveal
            text="Let's build something meaningful."
            tag="h2"
            className="text-display"
            mode="slide-up"
            staggerChildren={0.05}
          />
        </div>

        {/* Subtitle */}
        <motion.div
          className="mb-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MetadataLabel>
            Open to internships, freelance & collaborations
          </MetadataLabel>
        </motion.div>

        <FineRule className="w-24 mb-16" delay={0.5} />

        {/* Contact links */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Email */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <MetadataLabel className="mb-2 block">Email</MetadataLabel>
            <CopyEmailButton />
          </motion.div>

          {/* GitHub */}
          <ContactLink label="GitHub" href={personal.github}>
            GitHub ↗
          </ContactLink>

          {/* LinkedIn */}
          <ContactLink label="LinkedIn" href={personal.linkedin}>
            LinkedIn ↗
          </ContactLink>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-auto pt-20"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <FineRule className="w-12 mx-auto mb-6" delay={0.8} />
          <MetadataLabel>© 2026 Akshat Siddh</MetadataLabel>
        </motion.footer>
      </div>
    </SectionWrapper>
  );
}

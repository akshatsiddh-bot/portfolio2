import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../systems/useReducedMotion';
import MetadataLabel from '../components/MetadataLabel';
import { personal } from '../data/personal';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   HERO — Entering the Experience
   01 / 06
   ────────────────────────────────────────────── */

const letterVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.04,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Hero() {
  const heroRef = useRef(null);
  const nameFirstRef = useRef(null);
  const nameLastRef = useRef(null);
  const metaRef = useRef(null);
  const scrollRef = useRef(null);
  const linesRef = useRef(null);
  const roleRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* GSAP scroll-driven transformation: Hero → About
     Hero elements physically migrate — name words split and fade to ghost traces,
     metadata migrates downward toward About's indicator position,
     decorative lines extend as structural bridges. */
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0–0.35): Name splits apart, words drift independently
      tl.to(
        nameFirstRef.current,
        { x: '-15vw', y: '-10vh', scale: 0.65, opacity: 0.08, duration: 0.35 },
        0
      )
      .to(
        nameLastRef.current,
        { x: '12vw', y: '8vh', scale: 0.65, opacity: 0.08, duration: 0.35 },
        0
      )

      // Phase 2 (0–0.25): Metadata migrates downward toward About area
      .to(
        roleRef.current,
        { y: '30vh', x: '-30vw', scale: 0.85, opacity: 0.6, duration: 0.35 },
        0
      )
      .to(metaRef.current, { opacity: 0, y: 40, duration: 0.2 }, 0)
      .to(scrollRef.current, { opacity: 0, duration: 0.12 }, 0)

      // Phase 3 (0.2–0.6): Decorative lines grow — structural bridges to About
      .fromTo(
        linesRef.current?.children || [],
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.04, duration: 0.3 },
        0.2
      )

      // Phase 4 (0.5–0.8): Ghost traces of name remain briefly
      .to(
        nameFirstRef.current,
        { x: '-22vw', y: '-15vh', opacity: 0.03, duration: 0.3 },
        0.5
      )
      .to(
        nameLastRef.current,
        { x: '20vw', y: '12vh', opacity: 0.03, duration: 0.3 },
        0.5
      )

      // Phase 5 (0.6–1.0): Role label settles at About indicator position
      .to(
        roleRef.current,
        { opacity: 0, duration: 0.2 },
        0.6
      )
      // Lines extend and fade
      .to(
        linesRef.current?.children || [],
        { opacity: 0, scaleX: 1.5, duration: 0.3, stagger: 0.03 },
        0.7
      )
      // Final clear
      .to(
        nameFirstRef.current,
        { opacity: 0, duration: 0.15 },
        0.85
      )
      .to(
        nameLastRef.current,
        { opacity: 0, duration: 0.15 },
        0.85
      );
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMobile]);

  const firstLetters = personal.firstName.split('');
  const lastLetters = personal.lastName.split('');

  const headingRef = useRef(null);
  const letterRefs = useRef([]);
  const [lensState, setLensState] = useState({ active: false, x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!headingRef.current || isMobile || prefersReducedMotion) return;
    const rect = headingRef.current.getBoundingClientRect();
    setLensState({
      active: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile && !prefersReducedMotion) {
      setLensState((prev) => ({ ...prev, active: true }));
    }
  };

  const handleMouseLeave = () => {
    setLensState({ active: false, x: 0, y: 0 });
  };

  const getLetterStyle = (idx) => {
    if (!lensState.active || prefersReducedMotion || isMobile) return {};
    const el = letterRefs.current[idx];
    if (!el || !headingRef.current) return {};

    const headingRect = headingRef.current.getBoundingClientRect();
    const letterRect = el.getBoundingClientRect();
    const lx = letterRect.left + letterRect.width / 2 - headingRect.left;
    const ly = letterRect.top + letterRect.height / 2 - headingRect.top;

    const dx = lx - lensState.x;
    const dy = ly - lensState.y;
    const dist = Math.hypot(dx, dy);

    const LENS_RADIUS = 110;
    const REFRACTION_ZONE = 75;

    // Inside lens: clearly recognizable, subtle crisp magnification
    if (dist < LENS_RADIUS - 15) {
      return {
        transform: 'scale(1.05)',
        transition: 'transform 0.12s ease-out',
      };
    }

    // Surrounding rim: subtly bent/refracted along radial vector
    if (dist < LENS_RADIUS + REFRACTION_ZONE) {
      const normalized = (dist - (LENS_RADIUS - 15)) / REFRACTION_ZONE;
      const force = Math.sin(normalized * Math.PI) * 11;
      const angle = Math.atan2(dy, dx);
      const pushX = Math.cos(angle) * force;
      const pushY = Math.sin(angle) * force;
      const rotate = Math.cos(angle) * (dx > 0 ? 3 : -3);

      return {
        transform: `translate3d(${pushX.toFixed(1)}px, ${pushY.toFixed(1)}px, 0) rotate(${rotate.toFixed(1)}deg) skewX(${(pushX * 0.35).toFixed(1)}deg)`,
        transition: 'transform 0.08s ease-out',
      };
    }

    return {
      transition: 'transform 0.2s ease-out',
    };
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      data-section="hero"
      aria-label="Hero — Introduction"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Section indicator */}
      <div className="absolute top-8 left-8">
        <MetadataLabel>01 / 06</MetadataLabel>
      </div>

      {/* Main content */}
      <div className="text-center px-6">
        {/* Name with circular lens hover interaction */}
        <div
          ref={headingRef}
          className="relative inline-block select-none cursor-default"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Circular lens element */}
          {lensState.active && !prefersReducedMotion && (
            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                left: lensState.x,
                top: lensState.y,
                width: 220,
                height: 220,
                transform: 'translate(-50%, -50%)',
                border:
                  '1.5px solid color-mix(in srgb, var(--accent-current) 45%, transparent)',
                boxShadow:
                  '0 0 26px color-mix(in srgb, var(--accent-current) 14%, transparent), inset 0 0 20px color-mix(in srgb, var(--accent-current) 10%, transparent)',
                background:
                  'radial-gradient(circle at 35% 35%, color-mix(in srgb, #fff 12%, transparent) 0%, transparent 65%)',
                backdropFilter: 'blur(0.5px)',
                WebkitBackdropFilter: 'blur(0.5px)',
                zIndex: 20,
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '1px solid color-mix(in srgb, #fff 25%, transparent)',
                  opacity: 0.5,
                }}
              />
            </div>
          )}

          <h1 className="text-display" style={{ fontSize: 'clamp(3rem, 10vw, 7.5rem)' }}>
            <span ref={nameFirstRef} className="inline-block">
              {prefersReducedMotion ? (
                personal.firstName
              ) : (
                firstLetters.map((letter, i) => (
                  <motion.span
                    key={`first-${i}`}
                    ref={(el) => (letterRefs.current[i] = el)}
                    className="inline-block"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={letterVariants}
                    style={getLetterStyle(i)}
                  >
                    {letter}
                  </motion.span>
                ))
              )}
            </span>
            <br />
            {/* Name — Last */}
            <span ref={nameLastRef} className="inline-block">
              {prefersReducedMotion ? (
                personal.lastName
              ) : (
                lastLetters.map((letter, i) => {
                  const letterIdx = i + firstLetters.length;
                  return (
                    <motion.span
                      key={`last-${i}`}
                      ref={(el) => (letterRefs.current[letterIdx] = el)}
                      className="inline-block"
                      custom={letterIdx}
                      initial="hidden"
                      animate="visible"
                      variants={letterVariants}
                      style={getLetterStyle(letterIdx)}
                    >
                      {letter}
                    </motion.span>
                  );
                })
              )}
            </span>
          </h1>
        </div>

        {/* Metadata — role migrates during transformation */}
        <div className="mt-8 space-y-3">
          <motion.div
            ref={roleRef}
            custom={0.6}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
          >
            <MetadataLabel>{personal.role}</MetadataLabel>
          </motion.div>
          <motion.div
            ref={metaRef}
            custom={0.75}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
          >
            <MetadataLabel className="block mt-1">
              {personal.tagline} · {personal.subtitle}
            </MetadataLabel>
          </motion.div>
        </div>
      </div>

      {/* Decorative lines — structural bridges that extend toward About */}
      <div
        ref={linesRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute left-0 w-full"
          style={{
            top: '33%',
            height: '1px',
            backgroundColor: 'var(--line)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
        <div
          className="absolute left-0 w-full"
          style={{
            top: '50%',
            height: '1px',
            backgroundColor: 'var(--accent-current)',
            opacity: 0.35,
            transformOrigin: 'center',
            transform: 'scaleX(0)',
          }}
        />
        <div
          className="absolute left-0 w-full"
          style={{
            top: '67%',
            height: '1px',
            backgroundColor: 'var(--line)',
            transformOrigin: 'right',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        ref={scrollRef}
        className="absolute bottom-10 text-center"
        custom={1.2}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate="visible"
        variants={fadeUp}
      >
        <MetadataLabel>Scroll to explore</MetadataLabel>
        <motion.div
          className="mt-3 mx-auto"
          style={{ width: '1px', height: '32px', backgroundColor: 'var(--line)' }}
          animate={prefersReducedMotion ? {} : { scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../systems/useReducedMotion";
import MetadataLabel from "../components/MetadataLabel";
import { personal } from "../data/personal";

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

/* ── Lens constants ── */
const LENS_RADIUS = 72;
const INNER_ZONE = 54;
const REFRACT_ZONE = 110;

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

  /* ── Lens refs (no React state for position — direct DOM for perf) ── */
  const headingRef = useRef(null);
  const letterElsRef = useRef([]);
  const lensCircleRef = useRef(null);
  const lensActiveRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [lensVisible, setLensVisible] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── GSAP scroll-driven transformation (unchanged) ── */
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      tl.to(
        nameFirstRef.current,
        {
          x: "-15vw",
          y: "-10vh",
          scale: 0.65,
          opacity: 0.08,
          duration: 0.35,
        },
        0,
      )
        .to(
          nameLastRef.current,
          {
            x: "12vw",
            y: "8vh",
            scale: 0.65,
            opacity: 0.08,
            duration: 0.35,
          },
          0,
        )
        .to(
          roleRef.current,
          {
            y: "30vh",
            x: "-30vw",
            scale: 0.85,
            opacity: 0.6,
            duration: 0.35,
          },
          0,
        )
        .to(metaRef.current, { opacity: 0, y: 40, duration: 0.2 }, 0)
        .to(scrollRef.current, { opacity: 0, duration: 0.12 }, 0)
        .fromTo(
          linesRef.current?.children || [],
          { scaleX: 0 },
          { scaleX: 1, stagger: 0.04, duration: 0.3 },
          0.2,
        )
        .to(
          nameFirstRef.current,
          {
            x: "-22vw",
            y: "-15vh",
            opacity: 0.03,
            duration: 0.3,
          },
          0.5,
        )
        .to(
          nameLastRef.current,
          {
            x: "20vw",
            y: "12vh",
            opacity: 0.03,
            duration: 0.3,
          },
          0.5,
        )
        .to(roleRef.current, { opacity: 0, duration: 0.2 }, 0.6)
        .to(
          linesRef.current?.children || [],
          {
            opacity: 0,
            scaleX: 1.5,
            duration: 0.3,
            stagger: 0.03,
          },
          0.7,
        )
        .to(nameFirstRef.current, { opacity: 0, duration: 0.15 }, 0.85)
        .to(nameLastRef.current, { opacity: 0, duration: 0.15 }, 0.85);
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMobile]);

  /* ── Lens: rAF loop for smooth per-letter distortion ── */
  const applyLens = useCallback(() => {
    if (!lensActiveRef.current || !headingRef.current) return;

    const hRect = headingRef.current.getBoundingClientRect();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    /* ── Position the smaller lens circle ── */
    if (lensCircleRef.current) {
      lensCircleRef.current.style.transform = `translate(${mx - LENS_RADIUS}px, ${my - LENS_RADIUS}px)`;
    }

    /* ── Per-letter distortion ── */
    const els = letterElsRef.current;

    for (let idx = 0; idx < els.length; idx++) {
      const el = els[idx];
      if (!el) continue;

      const lr = el.getBoundingClientRect();

      const lx = lr.left + lr.width / 2 - hRect.left;
      const ly = lr.top + lr.height / 2 - hRect.top;

      const dx = lx - mx;
      const dy = ly - my;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < INNER_ZONE) {
        /* ──────────────────────────────────────
           Inside lens core
           Stronger magnification
           ────────────────────────────────────── */
        const proximity = 1 - dist / INNER_ZONE;

        const s = 1 + proximity * 0.12;

        el.style.transform = `scale(${s})`;
        el.style.transition = "transform 0.08s ease-out";
      } else if (dist < INNER_ZONE + REFRACT_ZONE) {
        /* ──────────────────────────────────────
           Refraction rim
           Stronger outward "giggle"
           ────────────────────────────────────── */

        /*
         * Increased from 9px → 18px.
         * This is the main intensity change.
         */
        const t = (dist - INNER_ZONE) / REFRACT_ZONE;

        // Strong near the lens, gradually fading outward
        const force = Math.pow(Math.sin(t * Math.PI), 0.7) * 18;

        const angle = Math.atan2(dy, dx);

        const px = Math.cos(angle) * force;
        const py = Math.sin(angle) * force;

        /*
         * Increased from 2.5deg → 5deg.
         * This gives the letters more rotational/skewed movement.
         */
        const skew = Math.cos(angle) * (dx > 0 ? 5 : -5) * (1 - t);

        el.style.transform = `
          translate3d(
            ${px.toFixed(1)}px,
            ${py.toFixed(1)}px,
            0
          )
          skewX(${skew.toFixed(1)}deg)
        `;

        el.style.transition = "transform 0.04s ease-out";
      } else {
        /* ── Outside lens — reset ── */
        el.style.transform = "";
        el.style.transition = "transform 0.18s ease-out";
      }
    }

    rafRef.current = requestAnimationFrame(applyLens);
  }, []);

  const clearLens = useCallback(() => {
    const els = letterElsRef.current;

    for (let i = 0; i < els.length; i++) {
      if (els[i]) {
        els[i].style.transform = "";
        els[i].style.transition = "transform 0.25s ease-out";
      }
    }
  }, []);

  const onNameMouseMove = useCallback((e) => {
    if (!headingRef.current) return;

    const rect = headingRef.current.getBoundingClientRect();

    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const onNameEnter = useCallback(() => {
    if (isMobile || prefersReducedMotion) return;

    lensActiveRef.current = true;
    setLensVisible(true);

    rafRef.current = requestAnimationFrame(applyLens);
  }, [isMobile, prefersReducedMotion, applyLens]);

  const onNameLeave = useCallback(() => {
    lensActiveRef.current = false;
    setLensVisible(false);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    clearLens();
  }, [clearLens]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const firstLetters = personal.firstName.split("");
  const lastLetters = personal.lastName.split("");
  const totalLetters = firstLetters.length + lastLetters.length;

  // Ensure refs array is correct length
  if (letterElsRef.current.length !== totalLetters) {
    letterElsRef.current = Array(totalLetters).fill(null);
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      data-section="hero"
      aria-label="Hero — Introduction"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Section indicator */}
      <div className="absolute top-8 left-8">
        <MetadataLabel>01 / 06</MetadataLabel>
      </div>

      {/* Main content */}
      <div className="text-center px-6">
        {/* Name — with lens hover interaction */}
        <div
          ref={headingRef}
          className="relative inline-block"
          onMouseMove={onNameMouseMove}
          onMouseEnter={onNameEnter}
          onMouseLeave={onNameLeave}
        >
          {/* Lens circle — smaller glass ring */}
          {lensVisible && (
            <div
              ref={lensCircleRef}
              className="absolute pointer-events-none"
              style={{
                width: LENS_RADIUS * 2,
                height: LENS_RADIUS * 2,
                borderRadius: "50%",
                border:
                  "1.5px solid color-mix(in srgb, var(--accent-current) 40%, transparent)",
                boxShadow:
                  "0 0 24px color-mix(in srgb, var(--accent-current) 10%, transparent)," +
                  "inset 0 0 18px color-mix(in srgb, var(--accent-current) 6%, transparent)",
                background:
                  "radial-gradient(circle at 38% 38%, color-mix(in srgb, #fff 8%, transparent) 0%, transparent 60%)",
                backdropFilter: "blur(0.4px)",
                WebkitBackdropFilter: "blur(0.4px)",
                zIndex: 20,
                willChange: "transform",
              }}
            >
              {/* Inner highlight ring */}
              <div
                className="absolute inset-[3px] rounded-full"
                style={{
                  border:
                    "0.5px solid color-mix(in srgb, #fff 18%, transparent)",
                }}
              />
            </div>
          )}

          <h1
            className="text-display"
            style={{ fontSize: "clamp(3rem, 10vw, 7.5rem)" }}
          >
            <span ref={nameFirstRef} className="inline-block">
              {prefersReducedMotion
                ? personal.firstName
                : firstLetters.map((letter, i) => (
                    <motion.span
                      key={`first-${i}`}
                      ref={(el) => {
                        letterElsRef.current[i] = el;
                      }}
                      className="inline-block"
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={letterVariants}
                      style={{ willChange: "transform" }}
                    >
                      {letter}
                    </motion.span>
                  ))}
            </span>

            <br />

            <span ref={nameLastRef} className="inline-block">
              {prefersReducedMotion
                ? personal.lastName
                : lastLetters.map((letter, i) => {
                    const idx = i + firstLetters.length;

                    return (
                      <motion.span
                        key={`last-${i}`}
                        ref={(el) => {
                          letterElsRef.current[idx] = el;
                        }}
                        className="inline-block"
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        variants={letterVariants}
                        style={{ willChange: "transform" }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
            </span>
          </h1>
        </div>

        {/* Metadata — role migrates during transformation */}
        <div className="mt-8 space-y-3">
          <motion.div
            ref={roleRef}
            custom={0.6}
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
            variants={fadeUp}
          >
            <MetadataLabel>{personal.role}</MetadataLabel>
          </motion.div>

          <motion.div
            ref={metaRef}
            custom={0.75}
            initial={prefersReducedMotion ? false : "hidden"}
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
            top: "33%",
            height: "1px",
            backgroundColor: "var(--line)",
            transformOrigin: "left",
            transform: "scaleX(0)",
          }}
        />

        <div
          className="absolute left-0 w-full"
          style={{
            top: "50%",
            height: "1px",
            backgroundColor: "var(--accent-current)",
            opacity: 0.35,
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />

        <div
          className="absolute left-0 w-full"
          style={{
            top: "67%",
            height: "1px",
            backgroundColor: "var(--line)",
            transformOrigin: "right",
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        ref={scrollRef}
        className="absolute bottom-10 text-center"
        custom={1.2}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        variants={fadeUp}
      >
        <MetadataLabel>Scroll to explore</MetadataLabel>

        <motion.div
          className="mt-3 mx-auto"
          style={{
            width: "1px",
            height: "32px",
            backgroundColor: "var(--line)",
          }}
          animate={prefersReducedMotion ? {} : { scaleY: [1, 0.5, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}

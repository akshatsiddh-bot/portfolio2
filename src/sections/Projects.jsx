import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../systems/useReducedMotion";
import { useInView } from "../systems/useInView";
import MetadataLabel from "../components/MetadataLabel";
import FineRule from "../components/FineRule";
import ProjectVisual from "../components/ProjectVisual";
import { projects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   PROJECTS — Visual Centerpiece
   04 / 06
   One project at a time. Project structures
   recompose into the next project, not just fade.
   ────────────────────────────────────────────── */

/* ── Project content layout ── */
function ProjectContent({ project, isDesktop = false }) {
  return (
    <div
      className={`${
        isDesktop
          ? "grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14 w-full"
          : ""
      }`}
      data-cursor="project"
      data-cursor-label="VIEW"
    >
      {/* Left: text content */}
      <div className={`${isDesktop ? "lg:col-span-7" : "flex-1 max-w-2xl"}`}>
        {/* Category + Year */}
        <MetadataLabel className="mb-6 block project-meta">
          {project.category} · {project.year}
        </MetadataLabel>

        {/* Number + Title */}
        <div className="flex items-start gap-6 md:gap-8 mb-6">
          <span
            className="text-display flex-shrink-0 project-number"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              lineHeight: 1,
              color: "var(--accent-current)",
              opacity: 0.25,
            }}
          >
            {project.number}
          </span>

          <div className="flex-1 pt-1">
            <h3
              className="text-display mb-2 project-title"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                lineHeight: 1.15,
              }}
            >
              {project.title}
            </h3>

            <span
              className="text-meta block project-role"
              style={{ color: "var(--accent-current)" }}
            >
              {project.role}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm md:text-base leading-relaxed mb-6 max-w-xl project-desc"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 project-tags">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1 text-xs font-medium rounded-sm transition-colors duration-300"
              style={{
                border: "1px solid var(--line)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent-current)";
                e.currentTarget.style.color = "#F5F0EB";
                e.currentTarget.style.borderColor = "var(--accent-current)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--line)";
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <FineRule animate={false} />
      </div>

      {/* Right: Project visual */}
      {isDesktop && (
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center project-visual">
          <div className="w-full max-w-[360px] aspect-square flex items-center justify-center p-5 xl:p-6 rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--accent-current)_4%,transparent)]">
            <div className="w-full h-full flex items-center justify-center">
              <ProjectVisual projectId={project.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Mobile project card ── */
function ProjectCard({ project }) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className="py-12"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <ProjectContent project={project} />

      {/* Show visual below on mobile */}
      <div className="mt-8 flex justify-center p-6 rounded-lg border border-[var(--line)] bg-[color-mix(in_srgb,var(--accent-current)_4%,transparent)]">
        <ProjectVisual projectId={project.id} />
      </div>
    </motion.article>
  );
}

/* ── Magnetic GitHub Button ── */
function MagneticGithubButton() {
  const buttonRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Keep the magnetic movement subtle.
      const strength = 0.16;

      gsap.to(buttonRef.current, {
        x: x * strength,
        y: y * strength,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    },
    [prefersReducedMotion],
  );

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion || !buttonRef.current) return;

    gsap.to(buttonRef.current, {
      scale: 1.04,
      duration: 0.3,
      ease: "power2.out",
      overwrite: true,
    });
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.45)",
      overwrite: true,
    });
  }, []);

  return (
    <div className="flex justify-center px-4">
      <a
        ref={buttonRef}
        href="https://github.com/akshatsiddh-bot"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View more projects on GitHub"
        data-cursor="link"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="
          group
          inline-flex
          min-h-[48px]
          items-center
          justify-center
          gap-3
          rounded-full
          border
          px-7
          py-3.5
          text-sm
          font-medium
          touch-manipulation
          transition-colors
          duration-300
          md:px-8
        "
        style={{
          borderColor: "var(--line)",
          color: "var(--text-primary)",
          WebkitTapHighlightColor: "transparent",
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = "var(--accent-current)";
          e.currentTarget.style.color = "#F5F0EB";
          e.currentTarget.style.borderColor = "var(--accent-current)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "var(--text-primary)";
          e.currentTarget.style.borderColor = "var(--line)";
        }}
        onClick={(e) => {
          // Reset any magnetic transform before navigation.
          if (buttonRef.current && !prefersReducedMotion) {
            gsap.to(buttonRef.current, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            });
          }
        }}
      >
        <span>View More Projects</span>

        <span
          className="
            inline-block
            transition-transform
            duration-300
            group-hover:translate-x-1
            group-hover:-translate-y-1
          "
          aria-hidden="true"
        >
          ↗
        </span>
      </a>
    </div>
  );
}

/* ── Main Projects Section ── */
export default function Projects() {
  const sectionRef = useRef(null);
  const pinnedRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  /* GSAP pinned project sequence — improved transitions where project
     structures recompose rather than simply fading. Number exits left
     while new number enters right. Tags contract then expand. The
     visual system cross-fades through the abstract project visual. */
  useEffect(() => {
    if (prefersReducedMotion || isMobile || !pinnedRef.current) return;

    const projectEls = pinnedRef.current.querySelectorAll(".project-slide");

    if (projectEls.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial state: first visible, rest hidden
      gsap.set(projectEls, {
        opacity: 0,
        visibility: "hidden",
      });

      gsap.set(projectEls[0], {
        opacity: 1,
        visibility: "visible",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: `+=${projects.length * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,

          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * projects.length),
              projects.length - 1,
            );

            setActiveProject(idx);
          },
        },
      });

      // Build transitions: current project recomposes into next
      projects.forEach((_, i) => {
        if (i >= projects.length - 1) return;

        const curr = projectEls[i];
        const next = projectEls[i + 1];

        const currNumber = curr.querySelector(".project-number");
        const currTitle = curr.querySelector(".project-title");
        const currMeta = curr.querySelector(".project-meta");
        const currRole = curr.querySelector(".project-role");
        const currDesc = curr.querySelector(".project-desc");
        const currTags = curr.querySelector(".project-tags");
        const currVisual = curr.querySelector(".project-visual");

        const nextNumber = next.querySelector(".project-number");
        const nextTitle = next.querySelector(".project-title");
        const nextMeta = next.querySelector(".project-meta");
        const nextRole = next.querySelector(".project-role");
        const nextDesc = next.querySelector(".project-desc");
        const nextTags = next.querySelector(".project-tags");
        const nextVisual = next.querySelector(".project-visual");

        const label = `project${i}`;

        tl
          // ─────────────────────────────────────
          // CURRENT PROJECT — DECOMPOSE
          // ─────────────────────────────────────

          .to(
            currNumber,
            {
              x: -35,
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
            },
            label,
          )

          .to(
            currTitle,
            {
              y: -12,
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
            },
            `${label}+=0.03`,
          )

          .to(
            currMeta,
            {
              x: 15,
              opacity: 0,
              duration: 0.16,
              ease: "power2.in",
            },
            `${label}+=0.06`,
          )

          .to(
            currRole,
            {
              opacity: 0,
              duration: 0.12,
              ease: "power2.in",
            },
            `${label}+=0.07`,
          )

          .to(
            currDesc,
            {
              y: -6,
              opacity: 0,
              duration: 0.16,
              ease: "power2.in",
            },
            `${label}+=0.08`,
          )

          .to(
            currTags,
            {
              y: 5,
              opacity: 0,
              duration: 0.14,
              ease: "power2.in",
            },
            `${label}+=0.08`,
          )

          .to(
            currVisual,
            {
              scale: 0.9,
              opacity: 0,
              duration: 0.24,
              ease: "power2.inOut",
            },
            `${label}+=0.05`,
          )

          // ─────────────────────────────────────
          // HIDE CURRENT
          // ─────────────────────────────────────

          .set(curr, {
            visibility: "hidden",
          })

          // ─────────────────────────────────────
          // PREPARE NEXT
          // ─────────────────────────────────────

          .set(next, {
            visibility: "visible",
            opacity: 1,
          })

          // ─────────────────────────────────────
          // NEXT PROJECT — COMPOSE
          // ─────────────────────────────────────

          .fromTo(
            nextNumber,
            {
              x: 35,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            `${label}+=0.22`,
          )

          .fromTo(
            nextTitle,
            {
              y: 12,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.24,
              ease: "power2.out",
            },
            `${label}+=0.25`,
          )

          .fromTo(
            nextMeta,
            {
              x: -15,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.18,
              ease: "power2.out",
            },
            `${label}+=0.27`,
          )

          .fromTo(
            nextRole,
            {
              y: 4,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.14,
              ease: "power2.out",
            },
            `${label}+=0.29`,
          )

          .fromTo(
            nextDesc,
            {
              y: 6,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            `${label}+=0.3`,
          )

          .fromTo(
            nextTags,
            {
              y: 5,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.18,
              ease: "power2.out",
            },
            `${label}+=0.32`,
          )

          .fromTo(
            nextVisual,
            {
              scale: 0.9,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            `${label}+=0.25`,
          )

          // ─────────────────────────────────────
          // BREATHING SPACE
          // ─────────────────────────────────────

          .to(
            {},
            {
              duration: 0.18,
            },
          );
      });
    }, pinnedRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-section="projects"
      aria-label="Projects"
    >
      {/* Section indicator */}
      <div className="section-container pt-16 md:pt-20">
        <div className="mb-6">
          <MetadataLabel>04 / 06 — Projects</MetadataLabel>
        </div>

        <h2
          className="text-display mb-4"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}
        >
          Selected work.
        </h2>

        <p
          className="text-sm max-w-xl mb-12"
          style={{ color: "var(--text-secondary)" }}
        >
          Thoughtfully engineered projects with clean and modern interfaces.
        </p>
      </div>

      {/* Desktop: Pinned scroll-through */}
      {!isMobile && !prefersReducedMotion ? (
        <div
          ref={pinnedRef}
          className="relative"
          style={{ minHeight: "100vh" }}
        >
          <div
            className="section-container flex items-center"
            style={{
              minHeight: "100vh",
              paddingTop: "2rem",
              paddingBottom: "2rem",
            }}
          >
            <div className="relative w-full">
              {/* Large project number background */}
              <div
                className="absolute top-0 right-0 hidden lg:block"
                aria-hidden="true"
              >
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeProject}
                    className="text-display"
                    style={{
                      fontSize: "clamp(4rem, 8vw, 7rem)",
                      color: "var(--accent-current)",
                      opacity: 0.08,
                      lineHeight: 1,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.08 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* {projects[activeProject]?.number} */}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Project slides */}
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className={`project-slide ${
                    i === 0 ? "" : "absolute inset-0"
                  }`}
                  style={i !== 0 ? { top: 0, left: 0 } : {}}
                >
                  <ProjectContent project={project} isDesktop />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mobile / Reduced motion: Stacked cards */
        <div className="section-container">
          {projects.map((project, i) => (
            <div key={project.id}>
              <ProjectCard project={project} />

              {i < projects.length - 1 && <FineRule className="my-4" />}
            </div>
          ))}
        </div>
      )}

      {/* View more projects */}
      <div className="section-container pb-20 md:pb-28">
        <MagneticGithubButton />
      </div>
    </section>
  );
}

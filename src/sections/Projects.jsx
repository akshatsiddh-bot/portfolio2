import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../systems/useReducedMotion';
import { useInView } from '../systems/useInView';
import MetadataLabel from '../components/MetadataLabel';
import FineRule from '../components/FineRule';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   PROJECTS — Visual Centerpiece
   One project at a time, scroll-driven choreography
   ────────────────────────────────────────────── */

/* ── Single Project Card (for mobile stacked view) ── */
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className="py-16 md:py-20"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <ProjectContent project={project} />
    </motion.article>
  );
}

/* ── Project content layout (shared between pinned and stacked views) ── */
function ProjectContent({ project }) {
  return (
    <div className="max-w-3xl">
      {/* Category + Year */}
      <MetadataLabel className="mb-6 block">
        {project.category} · {project.year}
      </MetadataLabel>

      {/* Number + Title row */}
      <div className="flex items-start gap-6 md:gap-10 mb-6">
        <span
          className="text-display flex-shrink-0"
          style={{
            fontSize: 'clamp(3rem, 7vw, 5rem)',
            lineHeight: 1,
            color: 'var(--accent-current)',
            opacity: 0.3,
          }}
        >
          {project.number}
        </span>
        <div className="flex-1 pt-2">
          <h3
            className="text-display mb-2 transition-all duration-300"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
              lineHeight: 1.15,
            }}
          >
            {project.title}
          </h3>
          <span
            className="text-meta block"
            style={{ color: 'var(--accent-current)' }}
          >
            {project.role}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-base leading-relaxed mb-8 max-w-xl"
        style={{ color: 'var(--text-secondary)' }}
      >
        {project.description}
      </p>

      {/* Technology tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium rounded-sm transition-colors duration-300"
            style={{
              border: '1px solid var(--line)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-current)';
              e.currentTarget.style.color = '#F5F0EB';
              e.currentTarget.style.borderColor = 'var(--accent-current)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--line)';
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <FineRule animate={false} />
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
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* GSAP pinned scroll-through choreography (desktop only) */
  useEffect(() => {
    if (prefersReducedMotion || isMobile || !pinnedRef.current) return;

    const projectEls = pinnedRef.current.querySelectorAll('.project-slide');
    if (projectEls.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state: first project visible, rest hidden
      gsap.set(projectEls, { opacity: 0, y: 50 });
      gsap.set(projectEls[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: 'top top',
          end: `+=${projects.length * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * projects.length),
              projects.length - 1
            );
            setActiveProject(idx);
          },
        },
      });

      // Create transitions between projects
      projects.forEach((_, i) => {
        if (i < projects.length - 1) {
          tl
            // Current project exits
            .to(projectEls[i], {
              opacity: 0,
              y: -50,
              scale: 0.97,
              duration: 0.4,
              ease: 'power2.inOut',
            })
            // Next project enters
            .fromTo(
              projectEls[i + 1],
              { opacity: 0, y: 50, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
              },
              '-=0.15'
            )
            // Breathing space between transitions
            .to({}, { duration: 0.2 });
        }
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
          <MetadataLabel>04 / 05 — Projects</MetadataLabel>
        </div>
        <h2
          className="text-display mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          Selected work.
        </h2>
        <p
          className="text-sm max-w-xl mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          Thoughtfully engineered projects with clean and modern interfaces.
        </p>
      </div>

      {/* Desktop: Pinned scroll-through */}
      {!isMobile && !prefersReducedMotion ? (
        <div
          ref={pinnedRef}
          className="relative"
          style={{ minHeight: '100vh' }}
        >
          <div className="section-container flex items-center" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="relative w-full">
              {/* Project number indicator (fixed position within pinned area) */}
              <div className="absolute top-0 right-0 hidden lg:block">
                <motion.span
                  key={activeProject}
                  className="text-display"
                  style={{
                    fontSize: 'clamp(4rem, 8vw, 7rem)',
                    color: 'var(--accent-current)',
                    opacity: 0.1,
                    lineHeight: 1,
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {projects[activeProject]?.number}
                </motion.span>
              </div>

              {/* Project slides */}
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className={`project-slide ${i === 0 ? '' : 'absolute inset-0'}`}
                  style={i !== 0 ? { top: 0, left: 0 } : {}}
                >
                  <ProjectContent project={project} />
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
              <ProjectCard project={project} index={i} />
              {i < projects.length - 1 && <FineRule className="my-4" />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

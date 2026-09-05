import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../systems/useReducedMotion';
import { useInView } from '../systems/useInView';
import MetadataLabel from '../components/MetadataLabel';
import FineRule from '../components/FineRule';
import ProjectVisual from '../components/ProjectVisual';
import { projects } from '../data/projects';

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
      className={`${isDesktop ? 'flex items-start gap-10 lg:gap-16' : ''}`}
      data-cursor="project"
      data-cursor-label="VIEW"
    >
      {/* Left: text content */}
      <div className="flex-1 max-w-2xl">
        {/* Category + Year */}
        <MetadataLabel className="mb-6 block project-meta">
          {project.category} · {project.year}
        </MetadataLabel>

        {/* Number + Title */}
        <div className="flex items-start gap-6 md:gap-8 mb-6">
          <span
            className="text-display flex-shrink-0 project-number"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1,
              color: 'var(--accent-current)',
              opacity: 0.25,
            }}
          >
            {project.number}
          </span>
          <div className="flex-1 pt-1">
            <h3
              className="text-display mb-2 project-title"
              style={{
                fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
                lineHeight: 1.15,
              }}
            >
              {project.title}
            </h3>
            <span
              className="text-meta block project-role"
              style={{ color: 'var(--accent-current)' }}
            >
              {project.role}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6 max-w-xl project-desc"
          style={{ color: 'var(--text-secondary)' }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 project-tags">
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

      {/* Right: Abstract project visual */}
      {isDesktop && (
        <div className="flex-shrink-0 hidden lg:block project-visual">
          <ProjectVisual projectId={project.id} />
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
      <div className="mt-6 flex justify-center">
        <ProjectVisual projectId={project.id} />
      </div>
    </motion.article>
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

  /* GSAP pinned project sequence — improved transitions where project
     structures recompose rather than simply fading. Number exits left
     while new number enters right. Tags contract then expand. The
     visual system cross-fades through the abstract project visual. */
  useEffect(() => {
    if (prefersReducedMotion || isMobile || !pinnedRef.current) return;

    const projectEls = pinnedRef.current.querySelectorAll('.project-slide');
    if (projectEls.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial state: first visible, rest hidden
      gsap.set(projectEls, { opacity: 0, visibility: 'hidden' });
      gsap.set(projectEls[0], { opacity: 1, visibility: 'visible' });

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

      // Build transitions: current project recomposes into next
      projects.forEach((_, i) => {
        if (i < projects.length - 1) {
          const curr = projectEls[i];
          const next = projectEls[i + 1];

          tl
            // Current project elements decompose
            .to(curr.querySelector('.project-number'), {
              x: -60, opacity: 0, duration: 0.25, ease: 'power2.in',
            }, `project${i}`)
            .to(curr.querySelector('.project-title'), {
              y: -15, opacity: 0, duration: 0.2, ease: 'power2.in',
            }, `project${i}+=0.05`)
            .to(curr.querySelector('.project-meta'), {
              x: 20, opacity: 0, duration: 0.15, ease: 'power2.in',
            }, `project${i}+=0.08`)
            .to(curr.querySelector('.project-desc'), {
              opacity: 0, duration: 0.15,
            }, `project${i}+=0.1`)
            .to(curr.querySelector('.project-tags'), {
              scaleY: 0.8, opacity: 0, duration: 0.12,
            }, `project${i}+=0.1`)
            .to(curr.querySelector('.project-role'), {
              opacity: 0, duration: 0.1,
            }, `project${i}+=0.1`)
            .to(curr.querySelector('.project-visual'), {
              scale: 0.85, opacity: 0, duration: 0.2,
            }, `project${i}+=0.05`)

            // Current fully hidden
            .set(curr, { visibility: 'hidden' })

            // Next project elements compose in
            .set(next, { visibility: 'visible', opacity: 1 })
            .fromTo(next.querySelector('.project-number'), {
              x: 60, opacity: 0,
            }, {
              x: 0, opacity: 0.25, duration: 0.25, ease: 'power2.out',
            }, `project${i}+=0.25`)
            .fromTo(next.querySelector('.project-title'), {
              y: 15, opacity: 0,
            }, {
              y: 0, opacity: 1, duration: 0.25, ease: 'power2.out',
            }, `project${i}+=0.28`)
            .fromTo(next.querySelector('.project-meta'), {
              x: -20, opacity: 0,
            }, {
              x: 0, opacity: 1, duration: 0.2, ease: 'power2.out',
            }, `project${i}+=0.3`)
            .fromTo(next.querySelector('.project-role'), {
              opacity: 0,
            }, {
              opacity: 1, duration: 0.15,
            }, `project${i}+=0.32`)
            .fromTo(next.querySelector('.project-desc'), {
              opacity: 0,
            }, {
              opacity: 1, duration: 0.2,
            }, `project${i}+=0.33`)
            .fromTo(next.querySelector('.project-tags'), {
              scaleY: 0.8, opacity: 0,
            }, {
              scaleY: 1, opacity: 1, duration: 0.2,
            }, `project${i}+=0.35`)
            .fromTo(next.querySelector('.project-visual'), {
              scale: 0.85, opacity: 0,
            }, {
              scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out',
            }, `project${i}+=0.28`)

            // Breathing space
            .to({}, { duration: 0.15 });
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
          <MetadataLabel>04 / 06 — Projects</MetadataLabel>
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
          <div
            className="section-container flex items-center"
            style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}
          >
            <div className="relative w-full">
              {/* Large project number background */}
              <div className="absolute top-0 right-0 hidden lg:block" aria-hidden="true">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={activeProject}
                    className="text-display"
                    style={{
                      fontSize: 'clamp(4rem, 8vw, 7rem)',
                      color: 'var(--accent-current)',
                      opacity: 0.08,
                      lineHeight: 1,
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.08 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {projects[activeProject]?.number}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Project slides */}
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  className={`project-slide ${i === 0 ? '' : 'absolute inset-0'}`}
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
    </section>
  );
}

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../systems/useInView';
import { useReducedMotion } from '../systems/useReducedMotion';
import SectionWrapper from '../components/SectionWrapper';
import MetadataLabel from '../components/MetadataLabel';
import { skills, connections, CATEGORIES } from '../data/skills';

/* ──────────────────────────────────────────────
   SKILLS — Interactive Technical Constellation
   SVG-based network with hover interaction
   ────────────────────────────────────────────── */

/** Pre-calculate node positions grouped by category */
function calculatePositions(width, height) {
  const isMobile = width < 600;
  const scale = isMobile ? 0.55 : 1;

  const centers = {
    languages: { x: 180 * scale, y: 120 * scale },
    frontend: { x: 780 * scale, y: 100 * scale },
    backend: { x: 160 * scale, y: 320 * scale },
    databases: { x: 820 * scale, y: 300 * scale },
    devops: { x: 180 * scale, y: 500 * scale },
    tools: { x: 500 * scale, y: 480 * scale },
    testing: { x: 820 * scale, y: 500 * scale },
  };

  const positions = {};
  const categorySkills = {};

  // Group skills by category
  skills.forEach((skill) => {
    if (!categorySkills[skill.category]) categorySkills[skill.category] = [];
    categorySkills[skill.category].push(skill);
  });

  // Position each skill in a circle around its category center
  Object.entries(categorySkills).forEach(([catId, catSkills]) => {
    const center = centers[catId];
    if (!center) return;
    const radius = Math.min(55, 30 + catSkills.length * 3) * scale;

    catSkills.forEach((skill, i) => {
      const angle = (i / catSkills.length) * Math.PI * 2 - Math.PI / 2;
      const jitterX = (Math.sin(i * 7.3) * 8) * scale;
      const jitterY = (Math.cos(i * 5.1) * 8) * scale;
      positions[skill.id] = {
        x: center.x + Math.cos(angle) * radius + jitterX,
        y: center.y + Math.sin(angle) * radius + jitterY,
      };
    });
  });

  return { positions, centers };
}

/** Get skills connected to a given skill ID */
function getConnected(skillId) {
  const connected = new Set();
  connections.forEach(([a, b]) => {
    if (a === skillId) connected.add(b);
    if (b === skillId) connected.add(a);
  });
  return connected;
}

/* ── Mobile: Categorized grid fallback ── */
function SkillsGrid() {
  const [activeSkill, setActiveSkill] = useState(null);
  const connectedSet = activeSkill ? getConnected(activeSkill) : new Set();

  return (
    <div className="space-y-8">
      {CATEGORIES.map((cat) => {
        const catSkills = skills.filter((s) => s.category === cat.id);
        return (
          <div key={cat.id}>
            <MetadataLabel className="mb-3 block">{cat.name}</MetadataLabel>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => {
                const isActive = activeSkill === skill.id;
                const isConnected = connectedSet.has(skill.id);
                const isDimmed = activeSkill && !isActive && !isConnected;

                return (
                  <motion.button
                    key={skill.id}
                    onClick={() =>
                      setActiveSkill(activeSkill === skill.id ? null : skill.id)
                    }
                    className="px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? cat.color
                        : isConnected
                        ? `${cat.color}22`
                        : 'transparent',
                      color: isActive ? '#F5F0EB' : 'var(--text-secondary)',
                      border: `1px solid ${isActive || isConnected ? cat.color : 'var(--line)'}`,
                      opacity: isDimmed ? 0.35 : 1,
                    }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {skill.name}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const HUB_SKILLS = new Set(['javascript', 'react', 'nodejs', 'docker', 'mongodb']);

function SkillsConstellation() {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const svgRef = useRef(null);
  const { hasBeenInView } = useInView(svgRef, { threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (hasBeenInView && !hasAnimated) setHasAnimated(true);
  }, [hasBeenInView, hasAnimated]);

  const { positions, centers } = useMemo(
    () => calculatePositions(1000, 600),
    []
  );

  const connectedSet = hoveredSkill ? getConnected(hoveredSkill) : new Set();

  const getCategoryColor = useCallback(
    (catId) => CATEGORIES.find((c) => c.id === catId)?.color || '#9B8E85',
    []
  );

  const shouldShow = hasAnimated || prefersReducedMotion;

  return (
    <div className="relative">
      {/* Interaction cue */}
      <div className="flex items-center gap-2 mb-4 text-meta" style={{ opacity: 0.8 }}>
        <span
          className="inline-block rounded-full animate-pulse"
          style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-current)' }}
          aria-hidden="true"
        />
        <span>Interactive Constellation · Hover nodes to trace connections</span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="w-full h-auto"
        style={{ maxHeight: '70vh' }}
        role="img"
        aria-label="Skills constellation — interactive visualization of technical skills"
      >
        {/* Connection lines */}
        {connections.map(([a, b], i) => {
          const posA = positions[a];
          const posB = positions[b];
          if (!posA || !posB) return null;

          const isHighlighted =
            hoveredSkill && (a === hoveredSkill || b === hoveredSkill);
          const isDimmed = hoveredSkill && !isHighlighted;

          return (
            <motion.line
              key={`conn-${i}`}
              x1={posA.x}
              y1={posA.y}
              x2={posB.x}
              y2={posB.y}
              stroke={isHighlighted ? 'var(--accent-current)' : 'var(--line)'}
              strokeWidth={isHighlighted ? 1.5 : 0.5}
              strokeDasharray={isHighlighted ? 'none' : '2 2'}
              initial={
                prefersReducedMotion ? { opacity: isDimmed ? 0.05 : 0.18 } : { pathLength: 0, opacity: 0 }
              }
              animate={
                shouldShow
                  ? {
                      pathLength: 1,
                      opacity: isDimmed ? 0.04 : isHighlighted ? 0.8 : 0.2,
                    }
                  : {}
              }
              transition={{
                pathLength: { duration: 0.8, delay: 0.2 + i * 0.015 },
                opacity: { duration: 0.25 },
              }}
            />
          );
        })}

        {/* Category labels */}
        {CATEGORIES.map((cat) => {
          const center = centers[cat.id];
          if (!center) return null;
          return (
            <motion.text
              key={`label-${cat.id}`}
              x={center.x}
              y={center.y - 70}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize={10}
              fontFamily="Inter, sans-serif"
              fontWeight={500}
              letterSpacing="0.1em"
              style={{ textTransform: 'uppercase' }}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={shouldShow ? { opacity: 0.6 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {cat.name}
            </motion.text>
          );
        })}

        {/* Skill nodes */}
        {skills.map((skill, i) => {
          const pos = positions[skill.id];
          if (!pos) return null;

          const isHovered = hoveredSkill === skill.id;
          const isConnected = connectedSet.has(skill.id);
          const isDimmed = hoveredSkill && !isHovered && !isConnected;
          const catColor = getCategoryColor(skill.category);
          const isHub = HUB_SKILLS.has(skill.id);

          return (
            <g
              key={skill.id}
              onMouseEnter={() => setHoveredSkill(skill.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Resting beacon pulse for hub skills */}
              {isHub && !hoveredSkill && !prefersReducedMotion && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={4}
                  fill="none"
                  stroke={catColor}
                  strokeWidth={0.75}
                  animate={{
                    r: [4, 12, 14],
                    opacity: [0.55, 0.15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: (i % 4) * 0.6,
                  }}
                />
              )}

              {/* Node circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 7 : isConnected ? 5.5 : 4}
                fill={catColor}
                initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
                animate={
                  shouldShow
                    ? {
                        scale: isHovered ? 1.25 : isConnected ? 1.15 : [1, 1.08, 1],
                        opacity: isDimmed ? 0.2 : 1,
                      }
                    : {}
                }
                transition={{
                  scale: isHovered || isConnected
                    ? { duration: 0.2 }
                    : {
                        duration: 3.2 + (i % 3),
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: (i % 5) * 0.3,
                      },
                  opacity: { duration: 0.2 },
                }}
              />

              {/* Hover ring */}
              {isHovered && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={13}
                  fill="none"
                  stroke={catColor}
                  strokeWidth={1}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Label */}
              <motion.text
                x={pos.x}
                y={pos.y + (isHovered ? -14 : 16)}
                textAnchor="middle"
                fill={isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'}
                fontSize={isHovered ? 12 : 9}
                fontFamily="Inter, sans-serif"
                fontWeight={isHovered ? 600 : 400}
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={
                  shouldShow
                    ? { opacity: isDimmed ? 0.2 : isHovered ? 1 : 0.7 }
                    : {}
                }
                transition={{ duration: 0.3, delay: 0.5 + i * 0.01 }}
              >
                {skill.name}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Main Skills Section ── */
export default function Skills() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <SectionWrapper id="skills" label="Skills">
      {/* Section indicator */}
      <div className="mb-12">
        <MetadataLabel>03 / 06 — Skills</MetadataLabel>
      </div>

      <div className="mb-8">
        <h2
          className="text-display mb-4"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          Tools & technologies I use.
        </h2>
        <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
          I work across frontend, backend, databases, and development tools to
          build responsive, scalable, and user-focused web applications.
        </p>
      </div>

      {isMobile ? <SkillsGrid /> : <SkillsConstellation />}
    </SectionWrapper>
  );
}

import { motion } from 'framer-motion';
import { useReducedMotion } from '../systems/useReducedMotion';

/*
 * ProjectVisual — Abstract editorial visual compositions.
 * Each project gets a unique spatial system using geometry, nodes,
 * lines, typography, and relationships that reflect the project concept.
 * NOT icons. NOT screenshots. Editorial geometry.
 */

const LINE_COLOR = 'var(--line)';
const ACCENT = 'var(--accent-current)';
const TEXT_TERTIARY = 'var(--text-tertiary)';

function AlumniVisual({ animate }) {
  /* Community network — interconnected nodes representing alumni connections */
  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
      {/* Central community hub */}
      <motion.circle
        cx="80"
        cy="70"
        r="3.5"
        fill={ACCENT}
        initial={animate ? { scale: 0 } : false}
        animate={
          animate
            ? { scale: [1, 1.25, 1], opacity: [1, 0.85, 1] }
            : { scale: 1 }
        }
        transition={{
          delay: 0.2,
          type: 'spring',
          stiffness: 200,
          scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      {/* Outer community nodes */}
      {[
        { x: 35, y: 30 },
        { x: 125, y: 30 },
        { x: 25, y: 90 },
        { x: 135, y: 90 },
        { x: 80, y: 20 },
        { x: 80, y: 120 },
      ].map((pos, i) => (
        <g key={i}>
          <motion.line
            x1="80"
            y1="70"
            x2={pos.x}
            y2={pos.y}
            stroke={LINE_COLOR}
            strokeWidth="0.5"
            initial={animate ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
          />
          <motion.circle
            cx={pos.x}
            cy={pos.y}
            r="2"
            fill={ACCENT}
            opacity="0.5"
            initial={animate ? { scale: 0 } : false}
            animate={
              animate
                ? {
                    scale: 1,
                    y: [0, i % 2 === 0 ? -2.5 : 2.5, 0],
                    x: [0, i % 3 === 0 ? 2 : -2, 0],
                  }
                : { scale: 1 }
            }
            transition={{
              delay: 0.5 + i * 0.06,
              type: 'spring',
              y: { duration: 3.6 + (i % 3) * 0.7, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 4 + (i % 2) * 0.8, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </g>
      ))}
      {/* Structural word */}
      <text
        x="80"
        y="138"
        textAnchor="middle"
        fill={TEXT_TERTIARY}
        fontSize="6"
        fontFamily="Inter, sans-serif"
        letterSpacing="0.15em"
        style={{ textTransform: 'uppercase' }}
      >
        NETWORK
      </text>
      {/* Cross connections — community links */}
      <motion.line
        x1="35"
        y1="30"
        x2="125"
        y2="30"
        stroke={LINE_COLOR}
        strokeWidth="0.3"
        opacity="0.4"
        initial={animate ? { pathLength: 0 } : false}
        animate={
          animate
            ? { pathLength: 1, opacity: [0.3, 0.6, 0.3] }
            : { pathLength: 1, opacity: 0.4 }
        }
        transition={{
          delay: 0.8,
          duration: 0.6,
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.line
        x1="25"
        y1="90"
        x2="135"
        y2="90"
        stroke={LINE_COLOR}
        strokeWidth="0.3"
        opacity="0.4"
        initial={animate ? { pathLength: 0 } : false}
        animate={
          animate
            ? { pathLength: 1, opacity: [0.3, 0.6, 0.3] }
            : { pathLength: 1, opacity: 0.4 }
        }
        transition={{
          delay: 0.9,
          duration: 0.6,
          opacity: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </svg>
  );
}

function HealthcareVisual({ animate }) {
  /* Layered data analysis — stacked horizontal data streams with analysis focal point */
  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
      {/* Data streams with restrained flow pulse */}
      {[25, 45, 65, 85, 105].map((y, i) => (
        <motion.line
          key={i}
          x1={20 + i * 5}
          y1={y}
          x2={140 - i * 5}
          y2={y}
          stroke={i === 2 ? ACCENT : LINE_COLOR}
          strokeWidth={i === 2 ? 1 : 0.5}
          initial={animate ? { pathLength: 0 } : false}
          animate={
            animate
              ? {
                  pathLength: 1,
                  opacity: [0.25 + i * 0.1, 0.65 + (i === 2 ? 0.25 : 0), 0.25 + i * 0.1],
                }
              : { pathLength: 1, opacity: i === 2 ? 0.8 : 0.3 + i * 0.1 }
          }
          transition={{
            delay: 0.15 * i,
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            },
          }}
        />
      ))}
      {/* Analysis focal point with radar ring */}
      <motion.circle
        cx="80"
        cy="65"
        r="4"
        fill="none"
        stroke={ACCENT}
        strokeWidth="0.8"
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={
          animate
            ? { scale: [1, 2.2], opacity: [0.7, 0] }
            : { scale: 1, opacity: 0.7 }
        }
        transition={{
          delay: 0.6,
          duration: 2.6,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      <motion.circle
        cx="80"
        cy="65"
        r="1.8"
        fill={ACCENT}
        initial={animate ? { scale: 0 } : false}
        animate={
          animate
            ? { scale: [1, 1.3, 1] }
            : { scale: 1 }
        }
        transition={{
          delay: 0.7,
          type: 'spring',
          scale: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      {/* Vertical analysis line */}
      <motion.line
        x1="80"
        y1="25"
        x2="80"
        y2="105"
        stroke={ACCENT}
        strokeWidth="0.4"
        opacity="0.35"
        strokeDasharray="2 3"
        initial={animate ? { pathLength: 0 } : false}
        animate={
          animate
            ? { pathLength: 1, strokeDashoffset: [0, -10] }
            : { pathLength: 1 }
        }
        transition={{
          delay: 0.4,
          duration: 0.8,
          strokeDashoffset: { duration: 3, repeat: Infinity, ease: 'linear' },
        }}
      />
      <text
        x="80"
        y="125"
        textAnchor="middle"
        fill={TEXT_TERTIARY}
        fontSize="6"
        fontFamily="Inter, sans-serif"
        letterSpacing="0.15em"
      >
        ANALYSIS
      </text>
    </svg>
  );
}

function CareerVisual({ animate }) {
  /* Application pipeline — directional flow with waypoints */
  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
      {/* Pipeline base flow line */}
      <motion.path
        d="M 30 30 L 80 30 L 80 70 L 130 70 L 130 110"
        stroke={ACCENT}
        strokeWidth="0.8"
        fill="none"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      />
      {/* Continuous flow packet travelling along pipeline */}
      {animate && (
        <motion.path
          d="M 30 30 L 80 30 L 80 70 L 130 70 L 130 110"
          stroke={ACCENT}
          strokeWidth="1.6"
          fill="none"
          strokeDasharray="18 160"
          animate={{ strokeDashoffset: [178, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
          opacity="0.85"
        />
      )}
      {/* Waypoint nodes */}
      {[
        { x: 30, y: 30, label: 'SEARCH' },
        { x: 80, y: 70, label: 'APPLY' },
        { x: 130, y: 110, label: 'HIRE' },
      ].map((wp, i) => (
        <g key={i}>
          <motion.circle
            cx={wp.x}
            cy={wp.y}
            r="3"
            fill={ACCENT}
            initial={animate ? { scale: 0 } : false}
            animate={
              animate
                ? { scale: [1, 1.3, 1] }
                : { scale: 1 }
            }
            transition={{
              delay: 0.3 + i * 0.25,
              type: 'spring',
              stiffness: 200,
              scale: { duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' },
            }}
          />
          <motion.text
            x={wp.x + 8}
            y={wp.y + 3}
            fill={TEXT_TERTIARY}
            fontSize="5.5"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.1em"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 + i * 0.2 }}
          >
            {wp.label}
          </motion.text>
        </g>
      ))}
      {/* Background grid lines */}
      {[50, 90].map((x, i) => (
        <motion.line
          key={`v${i}`}
          x1={x}
          y1="20"
          x2={x}
          y2="120"
          stroke={LINE_COLOR}
          strokeWidth="0.3"
          opacity="0.2"
          initial={animate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
        />
      ))}
    </svg>
  );
}

function DashboardVisual({ animate }) {
  /* Metrics grid — structured data visualization with highlighted active metric */
  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
      {/* Grid cells */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const x = 30 + col * 38;
          const y = 20 + row * 38;
          const isActive = row === 1 && col === 1;
          return (
            <motion.rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="30"
              height="30"
              rx="1"
              stroke={isActive ? ACCENT : LINE_COLOR}
              strokeWidth={isActive ? 1 : 0.5}
              fill="none"
              initial={animate ? { scale: 0, opacity: 0 } : false}
              animate={
                animate && isActive
                  ? { scale: 1, opacity: [0.65, 0.95, 0.65] }
                  : { scale: 1, opacity: isActive ? 0.8 : 0.3 }
              }
              transition={{
                delay: 0.1 + (row * 3 + col) * 0.06,
                type: 'spring',
                stiffness: 200,
                opacity: isActive ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : {},
              }}
            />
          );
        })
      )}
      {/* Active metric indicator */}
      <motion.circle
        cx="83"
        cy="74"
        r="2"
        fill={ACCENT}
        initial={animate ? { scale: 0 } : false}
        animate={
          animate
            ? { scale: [1, 1.35, 1] }
            : { scale: 1 }
        }
        transition={{
          delay: 0.7,
          duration: 0.5,
          scale: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      {/* Rising bar in active cell with restrained height oscillation */}
      <motion.line
        x1="78"
        y1="82"
        x2="78"
        y2="68"
        stroke={ACCENT}
        strokeWidth="2"
        opacity="0.65"
        initial={animate ? { pathLength: 0 } : false}
        animate={
          animate
            ? { pathLength: 1, y2: [68, 64, 71, 68] }
            : { pathLength: 1, y2: 68 }
        }
        transition={{
          delay: 0.6,
          duration: 0.4,
          y2: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <text
        x="83"
        y="132"
        textAnchor="middle"
        fill={TEXT_TERTIARY}
        fontSize="6"
        fontFamily="Inter, sans-serif"
        letterSpacing="0.15em"
      >
        METRICS
      </text>
    </svg>
  );
}

function WorkspaceVisual({ animate }) {
  /* File tree / workspace structure — branching organizational hierarchy */
  return (
    <svg viewBox="0 0 160 140" fill="none" className="w-full h-full">
      {/* Root */}
      <motion.rect
        x="60"
        y="15"
        width="40"
        height="14"
        rx="1"
        stroke={ACCENT}
        strokeWidth="0.8"
        fill="none"
        initial={animate ? { scaleX: 0 } : false}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <text
        x="80"
        y="24"
        textAnchor="middle"
        fill={TEXT_TERTIARY}
        fontSize="5"
        fontFamily="Inter, sans-serif"
        letterSpacing="0.1em"
      >
        WORKSPACE
      </text>
      {/* Trunk */}
      <motion.line
        x1="80"
        y1="29"
        x2="80"
        y2="50"
        stroke={LINE_COLOR}
        strokeWidth="0.5"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />
      {/* Branches */}
      {[
        { x1: 80, y1: 50, x2: 35, y2: 70, label: 'FILES', lx: 35, ly: 85 },
        { x1: 80, y1: 50, x2: 80, y2: 70, label: 'PROJECTS', lx: 80, ly: 85 },
        { x1: 80, y1: 50, x2: 125, y2: 70, label: 'TEAMS', lx: 125, ly: 85 },
      ].map((br, i) => (
        <g key={i}>
          <motion.line
            x1={br.x1}
            y1={br.y1}
            x2={br.x2}
            y2={br.y2}
            stroke={LINE_COLOR}
            strokeWidth="0.5"
            initial={animate ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.45 + i * 0.1, duration: 0.3 }}
          />
          <motion.circle
            cx={br.x2}
            cy={br.y2}
            r="2.5"
            fill={ACCENT}
            opacity="0.6"
            initial={animate ? { scale: 0 } : false}
            animate={
              animate
                ? { scale: 1, y: [0, -1.8, 1, 0] }
                : { scale: 1 }
            }
            transition={{
              delay: 0.6 + i * 0.1,
              type: 'spring',
              y: { duration: 3.8 + i * 0.6, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
          <motion.text
            x={br.lx}
            y={br.ly}
            textAnchor="middle"
            fill={TEXT_TERTIARY}
            fontSize="5"
            fontFamily="Inter, sans-serif"
            letterSpacing="0.1em"
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          >
            {br.label}
          </motion.text>
        </g>
      ))}
      {/* Sub-branches for depth */}
      {[
        { x1: 35, y1: 70, x2: 22, y2: 100 },
        { x1: 35, y1: 70, x2: 48, y2: 100 },
        { x1: 125, y1: 70, x2: 112, y2: 100 },
        { x1: 125, y1: 70, x2: 138, y2: 100 },
      ].map((sb, i) => (
        <g key={`sub-${i}`}>
          <motion.line
            x1={sb.x1}
            y1={sb.y1}
            x2={sb.x2}
            y2={sb.y2}
            stroke={LINE_COLOR}
            strokeWidth="0.3"
            initial={animate ? { pathLength: 0 } : false}
            animate={
              animate
                ? { pathLength: 1, opacity: [0.3, 0.6, 0.3] }
                : { pathLength: 1, opacity: 0.4 }
            }
            transition={{
              delay: 0.8 + i * 0.08,
              duration: 0.3,
              opacity: { duration: 3.5 + (i % 2), repeat: Infinity, ease: 'easeInOut' },
            }}
          />
          <motion.circle
            cx={sb.x2}
            cy={sb.y2}
            r="1.5"
            fill={LINE_COLOR}
            opacity="0.5"
            initial={animate ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 + i * 0.08, type: 'spring' }}
          />
        </g>
      ))}
    </svg>
  );
}

const VISUALS = {
  'alumni-platform': AlumniVisual,
  'ai-healthcare': HealthcareVisual,
  'career-connect': CareerVisual,
  'nova-dashboard': DashboardVisual,
  'nexus-cloud': WorkspaceVisual,
};

export default function ProjectVisual({ projectId, animate = true }) {
  const prefersReducedMotion = useReducedMotion();
  const Visual = VISUALS[projectId];
  if (!Visual) return null;

  return (
    <div
      className="w-full h-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] aspect-square flex items-center justify-center"
      aria-hidden="true"
    >
      <Visual animate={animate && !prefersReducedMotion} />
    </div>
  );
}

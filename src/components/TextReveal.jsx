import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "../systems/useInView";
import { useReducedMotion } from "../systems/useReducedMotion";

/**
 * Deterministic pseudo-random: same index always produces same value.
 * Uses a simple hash to avoid Math.random() non-determinism.
 */
function seededRandom(index, seed = 0) {
  const x = Math.sin((index + 1) * 9301 + seed * 49297) * 49297;
  return x - Math.floor(x);
}

const modes = {
  "slide-up": {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  cascade: {
    hidden: { y: 12, opacity: 0, rotate: -1 },
    visible: { y: 0, opacity: 1, rotate: 0 },
  },
  burst: {
    hidden: (i) => ({
      x: Math.sin(i * 2.7) * 12,
      y: 10 + Math.cos(i * 1.9) * 8,
      opacity: 0,
    }),
    visible: { x: 0, y: 0, opacity: 1 },
  },
  /**
   * Editorial natural reveal — subtle and readable.
   */
  scatter: {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
};

export default function TextReveal({
  text,
  tag: Tag = "p",
  className = "",
  style = {},
  delay = 0,
  mode = "slide-up",
  staggerChildren = 0.02,
  asParagraph = false,
  prose = false,
}) {
  const ref = useRef(null);
  const { hasBeenInView } = useInView(ref, { threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();

  const isProse = asParagraph || prose || mode === "prose";
  const modeConfig = modes[mode] || modes["slide-up"];

  if (prefersReducedMotion) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  if (isProse) {
    const hiddenY = typeof modeConfig.hidden?.y === "number" ? modeConfig.hidden.y : 16;
    return (
      <Tag ref={ref} className={className} style={style}>
        <motion.span
          style={{ display: "block" }}
          initial={{ y: hiddenY, opacity: 0 }}
          animate={
            hasBeenInView
              ? { y: 0, opacity: 1 }
              : { y: hiddenY, opacity: 0 }
          }
          transition={{
            duration: 0.55,
            delay: delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {text}
        </motion.span>
      </Tag>
    );
  }

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      <motion.span
        style={{ display: "inline" }}
        initial="hidden"
        animate={hasBeenInView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerChildren || 0.015,
              delayChildren: delay,
            },
          },
        }}
      >
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
            <motion.span
              style={{ display: "inline-block" }}
              variants={{
                hidden:
                  typeof modeConfig.hidden === "function"
                    ? modeConfig.hidden(i)
                    : modeConfig.hidden,
                visible: {
                  ...modeConfig.visible,
                  transition: {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              aria-hidden="true"
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

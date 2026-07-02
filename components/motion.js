"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal — fades and lifts its children into view on scroll.
 * Falls back to a plain fade (or nothing) when reduced motion is preferred.
 */
export function Reveal({ children, delay = 0, y = 18, className, as = "div" }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

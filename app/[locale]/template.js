"use client";

import { motion, useReducedMotion } from "framer-motion";

// Wraps each route to animate page entry. `template.js` re-mounts on
// navigation, giving a clean enter transition without manual AnimatePresence.
export default function Template({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import React from "react";

interface MotionFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  className?: string;
}

export const MotionFade: React.FC<MotionFadeProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  y = 40,
  x = 0,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y, x }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    transition={{ delay, duration, type: "spring", stiffness: 60 }}
    className={className}
  >
    {children}
  </motion.div>
);

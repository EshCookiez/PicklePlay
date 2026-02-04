"use client";

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
}) => {
  const style = {
    animation: `fadeIn ${duration}s ease-out ${delay}s forwards`,
    opacity: 0,
    "--start-y": `${y}px`,
    "--start-x": `${x}px`,
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(var(--start-x), var(--start-y));
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
      `}</style>
      <div style={style} className={className}>
        {children}
      </div>
    </>
  );
};

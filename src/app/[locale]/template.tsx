'use client';

import { m } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.99, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 150, 
        damping: 20,
        mass: 0.8,
        duration: 0.6
      }}
    >
      {children}
    </m.div>
  );
}

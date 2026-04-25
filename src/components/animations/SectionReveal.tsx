'use client';

import { m } from 'framer-motion';
import React from 'react';

interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}

export default function SectionReveal({ children, delay = 0, className, id }: SectionRevealProps) {
  return (
    <m.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={className}
      data-section
    >
      {children}
    </m.section>
  );
}

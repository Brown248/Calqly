'use client';

import { m, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface CharacterRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function CharacterReveal({ text, className, delay = 0 }: CharacterRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 6,
      filter: "blur(4px)",
      scale: 1.05
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      scale: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 150,
      }
    },
  };
  return (
    <m.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {text.split('').map((char, i) => (
        <m.span
          key={i}
          variants={charVariants}
          className="inline-block whitespace-pre"
        >
          {char}
        </m.span>
      ))}
    </m.span>
  );
}

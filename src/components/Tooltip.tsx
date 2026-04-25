'use client';

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center group cursor-help"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children || <Info size={14} className="text-slate-400 hover:text-teal-500 transition-colors" />}
      
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[100] w-64 p-4 bg-slate-900 text-white text-xs font-medium rounded-2xl shadow-2xl pointer-events-none"
          >
            {content}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900" />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

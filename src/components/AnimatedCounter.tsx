'use client';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frameId: number;
    let isMounted = true;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 1500;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          if (isMounted) setCount(Math.floor(progress * target));
          if (progress < 1 && isMounted) frameId = requestAnimationFrame(step);
        };
        frameId = requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      isMounted = false;
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

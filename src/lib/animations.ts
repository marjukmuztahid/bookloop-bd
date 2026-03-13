import type { Transition } from 'framer-motion';

const smoothEase: [number, number, number, number] = [0.4, 0, 0.2, 1];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const noMotion = { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } };

export const fadeUp = prefersReducedMotion()
  ? noMotion
  : {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 8 },
      transition: { duration: 0.35, ease: smoothEase } satisfies Transition,
    };

export const staggerContainer = prefersReducedMotion()
  ? { animate: {} }
  : {
      animate: { transition: { staggerChildren: 0.04 } },
    };

export const pageTransition = prefersReducedMotion()
  ? noMotion
  : {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      transition: { duration: 0.45, ease: smoothEase } satisfies Transition,
    };

export const springButton = prefersReducedMotion()
  ? {}
  : {
      whileTap: { scale: 0.96 },
      transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
    };

export const cardHover = prefersReducedMotion()
  ? {}
  : {
      whileHover: { scale: 1.03, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' },
      transition: { type: 'spring' as const, stiffness: 300, damping: 22 },
    };

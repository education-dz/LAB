import { useReducedMotion } from 'motion/react';

export function useMotionPrefs() {
  const shouldReduceMotion = useReducedMotion();

  // If the user prefers reduced motion, we return a variant that just snaps to the final state.
  return {
    reducedMotion: shouldReduceMotion,
    pageTransition: shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.1 },
        }
      : {
          initial: { opacity: 0, y: 15, filter: 'blur(4px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 0.98, filter: 'blur(2px)' },
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        },
    cardReveal: shouldReduceMotion
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
        },
    staggerContainer: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.05,
        },
      },
    },
    hoverCard: shouldReduceMotion
      ? {}
      : {
          whileHover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
        },
  };
}

// Preset values for manual use
export const presets = {
  easeEditorial: [0.22, 1, 0.36, 1], // Apple-like snap
  easeWarm: [0.25, 1, 0.5, 1], // Smooth organic
};

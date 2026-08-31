import { useEffect } from 'react';

/**
 * Scroll reveal hook using IntersectionObserver
 * Watches elements with [data-reveal] and adds [reveal-in] when they enter viewport.
 * Supports [data-reveal-delay] (in ms) for staggered reveals.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fallback if IntersectionObserver is not supported or user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      elements.forEach((el) => {
        el.classList.add('reveal-in');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const delayStr = target.getAttribute('data-reveal-delay');
            const delay = delayStr ? parseInt(delayStr, 10) : 0;

            if (delay > 0) {
              setTimeout(() => {
                target.classList.add('reveal-in');
              }, delay);
            } else {
              target.classList.add('reveal-in');
            }

            obs.unobserve(target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    elements.forEach((el) => {
      // Ensure initial reveal class is applied
      el.classList.add('reveal');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}

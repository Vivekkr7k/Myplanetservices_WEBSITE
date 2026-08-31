import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../../lib/lenis-scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Refresh ScrollTrigger calculations on route change
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      // Honour deep links like /pricing#service-pricing once the page has mounted
      if (hash) {
        const target = document.querySelector(hash);
        if (target) scrollTo(target as HTMLElement, { offset: -100 });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, hash, scrollTo]);

  return null;
}


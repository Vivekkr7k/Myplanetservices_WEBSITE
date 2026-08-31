import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../../lib/lenis-scroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollToTop() {
  const { pathname } = useLocation();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Refresh ScrollTrigger calculations on route change
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname, scrollTo]);

  return null;
}


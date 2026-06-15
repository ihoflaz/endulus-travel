import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../../lib/gsap';

// Momentum smooth-scroll (Lenis) wired to GSAP's ticker + ScrollTrigger, so all
// scroll-driven animations stay perfectly in sync and jank-free. Disabled when
// the user prefers reduced motion. Exposes the instance via getLenis().

let lenisRef = null;
export const getLenis = () => lenisRef;

const SmoothScroll = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef = lenis;
    document.documentElement.classList.add('lenis');

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef = null;
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  // Reset scroll + recalc triggers on every route change.
  useEffect(() => {
    if (lenisRef) lenisRef.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // let the new page paint, then refresh ScrollTrigger measurements
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return children;
};

export default SmoothScroll;

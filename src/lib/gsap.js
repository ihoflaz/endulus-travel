// Single GSAP entry point — registers plugins once. GSAP is fully free
// (incl. ScrollTrigger) as of 2025, so we can use it in production.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

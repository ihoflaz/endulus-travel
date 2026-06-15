import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedLogo from '../brand/AnimatedLogo';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const EASE = [0.76, 0, 0.24, 1];

/* ------------------------------------------------------------------ *
 * IntroLoader — first-load brand splash (once per browser session).
 * Midnight curtain with the animated gold mark + wordmark, then lifts
 * away to reveal the site. Skipped for reduced-motion / repeat visits.
 * ------------------------------------------------------------------ */
export const IntroLoader = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (reduceMotion()) return false;
    try {
      if (sessionStorage.getItem('ds_intro_done')) return false;
    } catch { /* private mode */ }
    return true;
  });

  useEffect(() => {
    if (!show) return undefined;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      try { sessionStorage.setItem('ds_intro_done', '1'); } catch { /* ignore */ }
      setShow(false);
    }, 2100);
    return () => { clearTimeout(t); document.body.style.overflow = ''; };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center ds-grain"
          style={{ background: 'var(--ds-bg, #0a0e1a)' }}
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: EASE } }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedLogo size={64} variant="gold" withWordmark animate />
          </motion.div>
          <motion.div
            className="mt-8 h-px overflow-hidden"
            style={{ width: 200, background: 'var(--ds-line, rgba(246,239,225,0.12))' }}
          >
            <motion.div
              className="h-full"
              style={{ background: 'var(--ds-grad-gold, linear-gradient(90deg,#a6822f,#f7e7b8,#a6822f))' }}
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------------ *
 * RouteTransition — branded curtain wipe on public route changes.
 * A panel sweeps up from below, briefly covers the swap, then lifts
 * off the top. Skipped on first mount, admin routes, reduced-motion.
 * ------------------------------------------------------------------ */
export const RouteTransition = () => {
  const { pathname } = useLocation();
  const first = useRef(true);
  const counter = useRef(0);
  const [anim, setAnim] = useState(null);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reduceMotion()) return;
    if (pathname.startsWith('/admin')) return;
    counter.current += 1;
    setAnim({ id: counter.current });
  }, [pathname]);

  if (!anim) return null;

  return (
    <motion.div
      key={anim.id}
      className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-none ds-grain"
      style={{ background: 'var(--ds-bg, #0a0e1a)' }}
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 0.92, times: [0, 0.42, 0.56, 1], ease: EASE }}
      onAnimationComplete={() => setAnim(null)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.85, 1, 1, 0.95] }}
        transition={{ duration: 0.92, times: [0, 0.42, 0.56, 1], ease: 'easeInOut' }}
      >
        <AnimatedLogo size={54} variant="gold" withWordmark={false} animate={false} />
      </motion.div>
    </motion.div>
  );
};

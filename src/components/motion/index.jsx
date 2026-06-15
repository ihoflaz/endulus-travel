import { useRef, useEffect, useState } from 'react';
import {
  motion, useScroll, useTransform, useInView, animate,
} from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

/* Fade + rise into view on scroll. */
export const Reveal = ({ children, y = 40, delay = 0, duration = 0.9, once = true, className = '', as = 'div' }) => {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
};

/* Word-by-word mask reveal (words rise from behind a clip). Great for headings. */
export const TextReveal = ({ text, className = '', delay = 0, stagger = 0.035, once = true, as: Tag = 'span' }) => {
  const words = String(text || '').split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            initial={{ y: '115%' }}
            whileInView={{ y: 0 }}
            viewport={{ once, margin: '-8% 0px' }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/* Vertical parallax tied to the element's progress through the viewport. */
export const Parallax = ({ children, speed = 0.18, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

/* Magnetic hover — the child drifts toward the cursor. Pointer devices only. */
export const Magnetic = ({ children, strength = 0.35, className = '' }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{ display: 'inline-block', transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}
    >
      {children}
    </span>
  );
};

/* Count-up when scrolled into view. */
export const Counter = ({ to = 0, suffix = '', prefix = '', duration = 2, decimals = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration, ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  const shown = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('tr-TR');
  return <span ref={ref} className={className}>{prefix}{shown}{suffix}</span>;
};

/* Infinite horizontal marquee (pure CSS transform loop). */
export const Marquee = ({ children, speed = 28, className = '', reverse = false }) => {
  const items = Array.from({ length: 2 });
  return (
    <div className={`overflow-hidden ${className}`} style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
      <div
        style={{
          display: 'inline-flex', whiteSpace: 'nowrap',
          animation: `ds-marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items.map((_, i) => (
          <span key={i} aria-hidden={i === 1} style={{ display: 'inline-flex' }}>{children}</span>
        ))}
      </div>
    </div>
  );
};

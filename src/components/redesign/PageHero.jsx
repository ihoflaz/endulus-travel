import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { LocaleLink as Link } from '../LocaleLink';
import { TextReveal } from '../motion';

// Inner-page cinematic hero (shorter than the home hero). Optional looping
// background video with poster fallback; eyebrow + word-mask title + lede +
// breadcrumb. Each page passes its own location media.
const PageHero = ({
  video, poster, image, eyebrow, title, subtitle, breadcrumb = [], minH = '68svh',
}) => {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) return undefined;
    const play = () => el.play().catch(() => {});
    el.addEventListener('canplay', () => { setReady(true); play(); }, { once: true });
    if (el.readyState >= 2) { setReady(true); play(); }
    return undefined;
  }, []);

  const bg = poster || image;

  return (
    <section ref={ref} className="relative w-full overflow-hidden ds-dark ds-vignette ds-grain" style={{ minHeight: minH }}>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {bg && <img src={bg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />}
        {video && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
            src={video} poster={poster} muted loop playsInline preload="metadata" aria-hidden
          />
        )}
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0.6) 0%, rgba(7,10,18,0.25) 45%, rgba(7,10,18,0.9) 100%)' }} />

      <div className="relative z-10 ds-container flex flex-col justify-end" style={{ minHeight: minH, paddingTop: '8rem', paddingBottom: 'clamp(3rem,7vh,5rem)' }}>
        {breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
            className="mb-5 flex items-center gap-2 text-sm text-[var(--ds-text-muted)]"
          >
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {b.to ? <Link to={b.to} className="hover:text-[var(--ds-gold)] transition-colors">{b.label}</Link> : <span className="text-[var(--ds-gold)]">{b.label}</span>}
                {i < breadcrumb.length - 1 && <span className="opacity-40">/</span>}
              </span>
            ))}
          </motion.nav>
        )}
        {eyebrow && (
          <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="ds-eyebrow mb-4">{eyebrow}</motion.span>
        )}
        <h1 className="ds-display text-[var(--ds-text)] text-balance" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', maxWidth: '18ch' }}>
          <TextReveal text={title} delay={0.35} />
        </h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="ds-lead mt-6 max-w-[56ch]">
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHero;

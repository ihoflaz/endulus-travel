import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { LocaleLink as Link } from '../LocaleLink';
import { TextReveal, Magnetic } from '../motion';

// Full-bleed cinematic hero: looping muted background video (with poster), layered
// gradient + vignette, eyebrow + word-mask title, lede, dual CTA, and a scroll cue.
// Parallaxes gently as you scroll past. Reused across pages (one location each).
const CinematicHero = ({
  video, poster, eyebrow, title, subtitle, location,
  primary, secondary, align = 'center', minH = '100svh',
}) => {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) return undefined; // poster only
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    v.addEventListener('canplay', () => { setReady(true); play(); }, { once: true });
    return undefined;
  }, []);

  const items = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <section ref={ref} className="relative w-full overflow-hidden ds-dark ds-vignette ds-grain" style={{ minHeight: minH }}>
      {/* media */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {poster && (
          <img src={poster} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
        )}
        {video && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
            src={video}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        )}
      </motion.div>
      {/* overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0.55) 0%, rgba(7,10,18,0.25) 35%, rgba(7,10,18,0.85) 100%)' }} />

      {/* content */}
      <motion.div style={{ opacity: fade }} className="relative z-10 flex" >
        <div className={`ds-container flex flex-col justify-end ${items}`} style={{ minHeight: minH, paddingBottom: 'clamp(4rem, 10vh, 8rem)', paddingTop: '8rem' }}>
          {location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-5 inline-flex items-center gap-2 self-center"
            >
              <span className="ds-eyebrow">{eyebrow}</span>
            </motion.div>
          )}
          <h1 className="ds-display ds-h1 text-[var(--ds-text)] max-w-[16ch] text-balance mx-auto">
            <TextReveal text={title} delay={0.35} />
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }}
              className="ds-lead mt-6 max-w-[52ch] mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            {primary && (
              <Magnetic strength={0.4}>
                <Link to={primary.to} className="ds-btn">{primary.label}</Link>
              </Magnetic>
            )}
            {secondary && (
              <Link to={secondary.to} className="ds-btn-ghost">{secondary.label}</Link>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[var(--ds-text-muted)]"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block w-px h-10 overflow-hidden bg-white/15">
          <span className="block w-px h-10 bg-[var(--ds-gold)] animate-[ds-scrollcue_2.2s_var(--ds-ease)_infinite]" />
        </span>
      </motion.div>
    </section>
  );
};

export default CinematicHero;

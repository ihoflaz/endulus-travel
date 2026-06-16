import { useEffect, useRef } from 'react';

// Official Instagram embed — unauthenticated (no token). Renders the post/reel
// inline via the blockquote + embed.js processor. instagramData (oEmbed cache)
// is optional and only used later for the OG thumbnail; the live embed here
// needs just the permalink URL.
const SCRIPT = 'https://www.instagram.com/embed.js';

const loadEmbedJs = () =>
  new Promise((resolve) => {
    if (window.instgrm) return resolve();
    const existing = document.querySelector(`script[src="${SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      // already loaded but flag missing → resolve anyway on next tick
      setTimeout(resolve, 1500);
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });

const InstagramEmbed = ({ url }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!url) return undefined;
    let alive = true;
    loadEmbedJs().then(() => {
      if (alive && window.instgrm?.Embeds) window.instgrm.Embeds.process();
    });
    return () => { alive = false; };
  }, [url]);

  if (!url) return null;
  return (
    <div className="flex justify-center">
      <blockquote
        ref={ref}
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: 'transparent', border: 0, margin: '0 auto', maxWidth: 540, width: '100%', minWidth: 280 }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ds-gold-bright)' }}>
          Instagram&apos;da izle
        </a>
      </blockquote>
    </div>
  );
};

export default InstagramEmbed;

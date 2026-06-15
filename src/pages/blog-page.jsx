import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal, TextReveal } from '../components/motion';
import { useBlogPosts } from '../hooks';

const MEDIA = '/uploads/media';

// Blog sayfası bileşeni - Tüm blog yazılarını listeler (Desert Journals)
const BlogPage = () => {
  const { t } = useTranslation();
  const { blogPosts, isLoading, error } = useBlogPosts();

  const posts = Array.isArray(blogPosts) ? blogPosts : [];

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={t('blog.metaTitle', 'Seyahat Blogu - Endülüs Travel')}
        description={t('blog.metaDescription', 'Endülüs Travel blogunda destinasyon rehberleri, seyahat ipuçları ve ilham verici gezi hikayeleri sizi bekliyor. Bir sonraki tatiliniz için keşfedin.')}
      />

      <PageHero
        video={`${MEDIA}/desert.mp4`}
        poster={`${MEDIA}/desert.jpg`}
        eyebrow={t('blog.badge', 'Seyahat İlhamı ve Rehberlik')}
        title={t('blog.title')}
        subtitle={t('blog.subtitle')}
        breadcrumb={[
          { to: '/', label: t('navigation.home') },
          { label: t('navigation.blog') },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="ds-container">

          {/* Error State */}
          {error && (
            <Reveal className="mb-12">
              <div className="ds-glass rounded-2xl border border-[var(--ds-line-strong)] px-6 py-5 flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0 text-[var(--ds-terracotta)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-[var(--ds-text-soft)]">{error}</p>
              </div>
            </Reveal>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl ds-glass animate-pulse" style={{ aspectRatio: '3/4' }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ds-glass border border-[var(--ds-line)]">
                <svg className="w-9 h-9 text-[var(--ds-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="ds-display text-2xl text-[var(--ds-text)] mb-3">
                {t('blog.noPosts', 'Henüz blog yazısı yok')}
              </h3>
              <p className="text-[var(--ds-text-muted)]">
                {t('blog.noPostsDescription', 'Yakında harika içeriklerle karşınızda olacağız!')}
              </p>
            </div>
          ) : (
            /* Cinematic post grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={(index % 3) * 0.08} className="h-full">
                  <Link to={`/blog/${post.slug}`} className="group block h-full">
                    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl ds-glass border border-[var(--ds-glass-border)] transition-all duration-500 hover:border-[var(--ds-line-strong)]">
                      {/* Cover */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0) 35%, rgba(7,10,18,0.7) 100%)' }} />

                        {/* Category */}
                        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[var(--ds-overlay)] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--ds-gold-bright)] backdrop-blur-sm">
                          {post.category || t('blog.defaultCategory', 'Seyahat')}
                        </span>

                        {/* Date */}
                        {post.date && (
                          <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-[var(--ds-overlay)] px-3 py-1 text-xs text-[var(--ds-text-soft)] backdrop-blur-sm">
                            {post.date}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-6">
                        <h2 className="ds-display text-xl leading-snug text-[var(--ds-text)] transition-colors duration-300 group-hover:text-[var(--ds-gold-bright)]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.title}
                        </h2>
                        {post.summary && (
                          <p className="mt-3 text-sm leading-relaxed text-[var(--ds-text-muted)]" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {post.summary}
                          </p>
                        )}

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--ds-line)]">
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ds-gold)]">
                            {t('blog.readMore')}
                            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          {post.author && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-[var(--ds-on-gold)]" style={{ background: 'var(--ds-grad-gold)' }}>
                              {post.author.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing band */}
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '46vh' }}>
        <img src={`${MEDIA}/desert.jpg`} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.55), var(--ds-bg))' }} />
        <div className="relative z-10 ds-container py-20 text-center flex flex-col items-center">
          <Reveal><span className="ds-eyebrow">{t('blog.badge', 'Seyahat İlhamı ve Rehberlik')}</span></Reveal>
          <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(1.8rem,4.5vw,3.2rem)' }}>
            <TextReveal text={t('blog.title')} />
          </h2>
          <Reveal delay={0.2}>
            <p className="ds-lead mt-5 max-w-[48ch] mx-auto">{t('blog.subtitle')}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;

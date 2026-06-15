import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import { useBlogPostDetail } from '../hooks';
import { useEffect } from 'react';
import PageHero from '../components/redesign/PageHero';
import { Reveal, Magnetic } from '../components/motion';

const FALLBACK_IMG = '/uploads/media/desert.jpg';

// Blog detay sayfası bileşeni - Belirli bir blog yazısının detaylarını gösterir
const BlogDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { blogPost, isLoading, error, notFound, relatedPosts } = useBlogPostDetail(slug);

  useEffect(() => {
    // Sayfa yüklendiğinde en üste scroll yapma
    window.scrollTo(0, 0);
  }, [slug, blogPost]);

  if (isLoading) {
    return (
      <div className="ds-dark min-h-screen grid place-items-center pt-24" style={{ background: 'var(--ds-bg)' }}>
        <div className="relative">
          <div className="w-16 h-16 border-2 border-[var(--ds-line)] border-t-[var(--ds-gold)] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-[var(--ds-gold-bright)] rounded-full animate-ping opacity-40"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ds-dark min-h-screen grid place-items-center pt-24" style={{ background: 'var(--ds-bg)' }}>
        <div className="ds-container text-center max-w-2xl">
          <div className="ds-glass rounded-3xl p-10 md:p-14">
            <span className="ds-eyebrow">{t('blog.eyebrow', 'Çöl Günlükleri')}</span>
            <h1 className="ds-display text-2xl md:text-3xl text-[var(--ds-text)] mt-4 mb-8">{error}</h1>
            <Magnetic>
              <Link to="/blog" className="ds-btn-ghost">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('blog.backToBlog')}</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="ds-dark min-h-screen grid place-items-center pt-24" style={{ background: 'var(--ds-bg)' }}>
        <div className="ds-container text-center max-w-2xl">
          <div className="ds-glass rounded-3xl p-10 md:p-14">
            <div className="w-20 h-20 rounded-full grid place-items-center mx-auto mb-7 border border-[var(--ds-line-strong)]">
              <svg className="w-10 h-10 text-[var(--ds-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.528-.002L5 15.299a8.962 8.962 0 01-1.81-5.31V8.53A3.984 3.984 0 013 8c0-.552.448-1 1-1s1 .448 1 1a2 2 0 104 0c0-.552.448-1 1-1s1 .448 1 1a2 2 0 104 0c0-.552.448-1 1-1s1 .448 1 1a3.984 3.984 0 01-.19 1.532V10c0 .852-.129 1.675-.369 2.45z" />
              </svg>
            </div>
            <span className="ds-eyebrow">{t('error.404')}</span>
            <p className="ds-lead mt-4 mb-8">{t('blog.postNotFound')}</p>
            <Magnetic>
              <Link to="/blog" className="ds-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('blog.backToBlog')}</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    );
  }

  // Örnek içerik (gerçek bir API'den gelecek)
  const dummyContent = `
    <div class="space-y-6">
      <p class="ds-prose-p">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p class="ds-prose-p">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <h2 class="ds-prose-h2">Alt Başlık 1</h2>
      <p class="ds-prose-p">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
      <p class="ds-prose-p">
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
      </p>
      <h2 class="ds-prose-h2">Alt Başlık 2</h2>
      <p class="ds-prose-p">
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
      </p>
    </div>
  `;

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={blogPost?.title ? `${blogPost.title} - Endülüs Travel` : t('blog.metaTitle', 'Seyahat Blogu - Endülüs Travel')}
        description={blogPost?.summary || blogPost?.description || t('blog.metaDescription', 'Endülüs Travel seyahat blogu: tur rehberleri, gezi ipuçları ve ilham veren seyahat hikayeleriyle bir sonraki tatilinizi planlayın.')}
        image={blogPost?.coverImage}
        type="article"
      />

      {/* Scoped dark prose styles for the (dummy) HTML content */}
      <style>{`
        .ds-prose .ds-prose-p { font-size: 1.125rem; line-height: 1.85; color: var(--ds-text-soft); }
        .ds-prose .ds-prose-h2 {
          font-family: var(--ds-font-display); font-weight: 300; letter-spacing: -0.01em;
          font-size: clamp(1.6rem, 3vw, 2.1rem); color: var(--ds-text);
          margin-top: 2.5rem; margin-bottom: 1rem;
        }
      `}</style>

      {/* ===== Cinematic Hero (post cover image, desert fallback) ===== */}
      <PageHero
        image={blogPost?.coverImage || FALLBACK_IMG}
        poster={blogPost?.coverImage || FALLBACK_IMG}
        eyebrow={blogPost.category || t('blog.eyebrow', 'Çöl Günlükleri')}
        title={blogPost.title}
        subtitle={blogPost.summary}
        breadcrumb={[
          { to: '/', label: t('navigation.home') },
          { to: '/blog', label: t('navigation.blog') },
          { label: blogPost.title },
        ]}
      />

      {/* ===== Article body ===== */}
      <div className="ds-container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">

          {/* Meta + back row */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--ds-text-muted)]">
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--ds-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {blogPost.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--ds-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {blogPost.author || t('blog.authorName')}
                </span>
              </div>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-sm text-[var(--ds-text-soft)] hover:text-[var(--ds-gold)] transition-colors"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('blog.backToBlog')}</span>
              </Link>
            </div>
          </Reveal>

          {/* Editorial prose card */}
          <Reveal delay={0.05}>
            <article className="ds-glass rounded-3xl p-7 md:p-12">
              <div className="ds-prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dummyContent }} />
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-[var(--ds-line)]">
                <h3 className="ds-eyebrow mb-4">{t('blog.tags', 'Etiketler')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['Seyahat', 'Tur', 'Tatil', 'Keşif', 'Kültür'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm text-[var(--ds-text-soft)] border border-[var(--ds-line-strong)] hover:border-[var(--ds-gold)] hover:text-[var(--ds-gold-bright)] transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>

          {/* Author card */}
          <Reveal delay={0.1}>
            <div className="mt-10 ds-glass rounded-3xl p-7 md:p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full grid place-items-center text-2xl font-semibold flex-shrink-0 text-[var(--ds-on-gold)]" style={{ background: 'var(--ds-grad-gold)' }}>
                {blogPost.author ? blogPost.author.charAt(0) : 'A'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--ds-text)] mb-1">
                  {blogPost.author || t('blog.authorName')}
                </h3>
                <p className="text-[var(--ds-text-soft)] leading-relaxed">
                  {t('blog.authorBio')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto mt-20">
            <Reveal>
              <div className="text-center mb-12">
                <span className="ds-eyebrow">{t('blog.eyebrow', 'Çöl Günlükleri')}</span>
                <h2 className="ds-display text-2xl md:text-4xl text-[var(--ds-text)] mt-4">
                  {t('blog.relatedPosts')}
                </h2>
                <div className="ds-hairline w-24 mx-auto mt-6"></div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {relatedPosts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.08}>
                  <Link to={`/blog/${post.slug}`} className="group block h-full">
                    <div className="ds-glass rounded-3xl overflow-hidden h-full transition-transform duration-500 group-hover:-translate-y-1.5">
                      <div className="relative overflow-hidden h-52">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0) 40%, rgba(7,10,18,0.85) 100%)' }}></div>
                        {post.category && (
                          <span className="absolute top-3 left-3 ds-glass text-[var(--ds-gold-bright)] text-xs font-medium rounded-full px-3 py-1">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--ds-text-muted)]">
                          <svg className="w-4 h-4 text-[var(--ds-gold)]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{post.date}</span>
                        </div>

                        <h3 className="text-xl ds-display text-[var(--ds-text)] mb-3 group-hover:text-[var(--ds-gold-bright)] transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-[var(--ds-text-soft)] text-sm line-clamp-3 leading-relaxed mb-4">
                          {post.summary}
                        </p>

                        <div className="inline-flex items-center gap-1.5 text-[var(--ds-gold)] font-medium text-sm">
                          <span>{t('blog.readMore')}</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-5xl mx-auto mt-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl ds-grain text-center px-6 py-14 md:py-20" style={{ background: 'var(--ds-grad-night)', border: '1px solid var(--ds-line)' }}>
              <h3 className="ds-display text-2xl md:text-4xl text-[var(--ds-text)] mb-4">
                {t('blog.cta.moreStories', 'Daha Fazla Hikaye')}
              </h3>
              <p className="ds-lead max-w-2xl mx-auto mb-8">
                {t('blog.cta.exploreMore', 'Seyahat deneyimlerimizi ve rehberlerimizi keşfetmek için blog sayfamızı ziyaret edin.')}
              </p>
              <Magnetic>
                <Link to="/blog" className="ds-btn">
                  <span>{t('blog.cta.viewAllPosts', 'Tüm Yazıları Görüntüle')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;

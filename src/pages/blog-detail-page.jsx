import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useBlogPostDetail } from '../hooks';
import { useEffect } from 'react';

// Blog detay sayfası bileşeni - Belirli bir blog yazısının detaylarını gösterir
const BlogDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { blogPost, isLoading, error, notFound, relatedPosts } = useBlogPostDetail(slug);

  useEffect(() => {
    // Sayfa yüklendiğinde en üste scroll yapma
    window.scrollTo(0, 0);
    
    // Sayfa başlığı ayarla
    if (blogPost) {
      document.title = `${blogPost.title} - Endülüs Travel Blog`;
    }
  }, [slug, blogPost]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[color-primary]/30 border-t-[color-primary] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[color-secondary] rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-transition">
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-8 text-white animate-shake">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-4">{error}</h1>
                <Link 
                  to="/blog" 
                  className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>{t('blog.backToBlog')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="page-transition">
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 p-12 animate-fade-in">
              <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.528-.002L5 15.299a8.962 8.962 0 01-1.81-5.31V8.53A3.984 3.984 0 013 8c0-.552.448-1 1-1s1 .448 1 1a2 2 0 104 0c0-.552.448-1 1-1s1 .448 1 1a2 2 0 104 0c0-.552.448-1 1-1s1 .448 1 1a3.984 3.984 0 01-.19 1.532V10c0 .852-.129 1.675-.369 2.45z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('error.404')}</h1>
                <p className="text-gray-600 mb-8 text-lg">{t('blog.postNotFound')}</p>
                <Link 
                  to="/blog" 
                  className="group bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>{t('blog.backToBlog')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Örnek içerik (gerçek bir API'den gelecek)
  const dummyContent = `
    <div class="space-y-6">
      <p class="text-lg leading-relaxed text-gray-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p class="text-lg leading-relaxed text-gray-700">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <h2 class="text-3xl font-bold text-gray-800 mt-8 mb-4">Alt Başlık 1</h2>
      <p class="text-lg leading-relaxed text-gray-700">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
      <p class="text-lg leading-relaxed text-gray-700">
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
      </p>
      <h2 class="text-3xl font-bold text-gray-800 mt-8 mb-4">Alt Başlık 2</h2>
      <p class="text-lg leading-relaxed text-gray-700">
        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
      </p>
    </div>
  `;

  return (
    <div className="page-transition">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 animate-fade-in">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                {t('navigation.home')}
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <Link to="/blog" className="text-white/80 hover:text-white transition-colors">
                {t('navigation.blog')}
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{blogPost.title}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  {blogPost.category || t('blog.defaultCategory', 'Seyahat')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {blogPost.title}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {blogPost.summary}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-center space-x-6 text-white/80 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{blogPost.date}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>{blogPost.author || t('blog.authorName')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Back Link */}
          <Link 
            to="/blog" 
            className="group inline-flex items-center space-x-2 text-[color-primary] hover:text-blue-600 font-medium mb-8 transition-colors animate-fade-in"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('blog.backToBlog')}</span>
          </Link>
          
          {/* Premium Cover Image */}
          <div className="relative overflow-hidden rounded-2xl mb-12 shadow-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[16/9] overflow-hidden">
              <img 
                src={blogPost.coverImage} 
                alt={blogPost.title} 
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Premium Content Container */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent"></div>
            <div className="relative z-10 p-8 md:p-12">
              
              {/* Blog Content */}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: dummyContent }} />
              </div>

              {/* Tags Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('blog.tags', 'Etiketler')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['Seyahat', 'Tur', 'Tatil', 'Keşif', 'Kültür'].map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 text-[color-primary] text-sm font-medium rounded-full hover:from-[color-primary]/20 hover:to-blue-600/20 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Author Card */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6 flex-shrink-0">
                  {blogPost.author ? blogPost.author.charAt(0) : 'A'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {blogPost.author || t('blog.authorName')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('blog.authorBio')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {t('blog.relatedPosts')}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[color-primary] to-blue-600 rounded-full mx-auto"></div>
              </div>

              {/* Related Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post, index) => (
                  <Link 
                    to={`/blog/${post.slug}`} 
                    key={post.slug} 
                    className="group"
                    style={{ animationDelay: `${0.9 + (index * 0.1)}s` }}
                  >
                    {/* Premium Related Post Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 animate-fade-in h-full">
                      
                      {/* Background Effects */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full transform translate-x-6 -translate-y-6"></div>
                      
                      {/* Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm text-[color-primary] text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-6">
                        <div className="flex items-center mb-3 text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{post.date}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[color-primary] transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                          {post.summary}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center text-[color-primary] font-semibold group-hover:text-blue-600 transition-colors">
                          <span className="text-sm">{t('blog.readMore')}</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Premium CTA Section */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-blue-900">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t('blog.cta.moreStories', 'Daha Fazla Hikaye')}
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  {t('blog.cta.exploreMore', 'Seyahat deneyimlerimizi ve rehberlerimizi keşfetmek için blog sayfamızı ziyaret edin.')}
                </p>
                <Link 
                  to="/blog"
                  className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
                >
                  <span>{t('blog.cta.viewAllPosts', 'Tüm Yazıları Görüntüle')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 
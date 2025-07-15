import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks';

// Blog sayfası bileşeni - Tüm blog yazılarını listeler
const BlogPage = () => {
  const { t } = useTranslation();
  const { blogPosts, isLoading, error } = useBlogPosts();

  return (
    <div className="page-transition">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/tours/blog-bg.jpg)' }}
        ></div>
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/30 via-blue-600/20 to-[color-primary]/30"></div>
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
              <span className="text-[color-secondary]">{t('navigation.blog')}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {t('blog.badge', 'Seyahat İlhamı ve Rehberlik')}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('blog.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('blog.subtitle')}
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">{blogPosts?.length || 0}</h3>
                  <p className="text-white/90">Blog Yazısı</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">50+</h3>
                  <p className="text-white/90">Destinasyon Rehberi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">1000+</h3>
                  <p className="text-white/90">İlham Verici Hikaye</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Error Handling */}
      {error && (
            <div className="max-w-2xl mx-auto mb-12 animate-shake">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="relative z-10 flex items-center">
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
        </div>
      )}

          {/* Loading State */}
      {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[color-primary]/30 border-t-[color-primary] rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[color-secondary] rounded-full animate-ping"></div>
              </div>
        </div>
      ) : (
            <>
              {/* Premium Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts?.map((post, index) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.slug} 
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
                    {/* Premium Glass Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 animate-fade-in h-full">
                      
                      {/* Background Effects */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[color-primary]/10 to-transparent rounded-full transform -translate-x-6 translate-y-6"></div>

                      {/* Image Container */}
                      <div className="relative overflow-hidden h-56">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-[color-primary] text-xs font-semibold rounded-full shadow-lg">
                            {post.category || t('blog.defaultCategory', 'Seyahat')}
                          </span>
                        </div>

                        {/* Date Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            {post.date}
                          </span>
                        </div>
                </div>

                      {/* Content */}
                      <div className="relative z-10 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[color-primary] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>

                        {/* Read More Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-[color-primary] font-semibold group-hover:text-blue-600 transition-colors">
                    <span>{t('blog.readMore')}</span>
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>

                          {/* Author Avatar */}
                          <div className="w-8 h-8 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {post.author ? post.author.charAt(0) : 'A'}
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {!isLoading && (!blogPosts || blogPosts.length === 0) && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {t('blog.noPosts', 'Henüz blog yazısı yok')}
                    </h3>
                    <p className="text-gray-600">
                      {t('blog.noPostsDescription', 'Yakında harika içeriklerle karşınızda olacağız!')}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 
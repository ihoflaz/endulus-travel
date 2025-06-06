import { useState, useEffect } from 'react';

// ScrollToTop bileşeni - Sayfanın sağ altında yukarı çıkma butonu
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll pozisyonunu izle
  useEffect(() => {
    const toggleVisibility = () => {
      // 300px scroll yapıldığında butonu göster
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Sayfanın en üstüne çık
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-110 group"
          aria-label="Sayfanın üstüne çık"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 
import { useCallback } from 'react';

/**
 * URL oluşturma yardımcı hook'u
 * @returns {Function} - path parametresi alan ve bu path için tam URL döndüren bir fonksiyon
 */
export const useCreateUrl = () => {
  const createUrl = useCallback((path) => {
    // Path'in başındaki slash'ı kaldır (eğer varsa)
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Eğer path zaten tam bir URL ise, direkt olarak döndür
    if (path.startsWith('http')) {
      console.log(`Tam URL kullanılıyor: ${path}`);
      return path;
    }
    
    // PUBLIC_URL'yi al (eğer tanımlanmışsa)
    const publicUrl = window.location.origin; // Örn: "http://localhost:4173"
    
    // BASE_URL değerini düzgün formatta al
    let baseUrlSegment = '';
    if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
      // BASE_URL'nin başında ve sonunda / olup olmadığını kontrol et
      baseUrlSegment = import.meta.env.BASE_URL;
      if (!baseUrlSegment.startsWith('/')) {
        baseUrlSegment = '/' + baseUrlSegment;
      }
      if (baseUrlSegment.endsWith('/')) {
        baseUrlSegment = baseUrlSegment.slice(0, -1);
      }
    }
    
    // Tam URL oluştur (kök dizinden başlayarak)
    const fullUrl = `${publicUrl}${baseUrlSegment}/${cleanPath}`;
    
    // Debugging için URL'yi konsola yazdır
    console.log(`URL oluşturuldu: ${fullUrl} (path: ${path})`);
    
    return fullUrl;
  }, []);

  return createUrl;
}; 
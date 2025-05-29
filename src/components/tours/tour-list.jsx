import { useTranslation } from 'react-i18next';
import TourCard from './tour-card';

// TourList bileşeni - Filtrelenmiş turları listeleyen bileşen
const TourList = ({ 
  tours = [], 
  loading = false, 
  error = null, 
  getCategoryLabel,
  emptyMessage
}) => {
  const { t } = useTranslation();

  // Yükleme durumu
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-center text-red-500">
        {error}
      </div>
    );
  }

  // Turların bulunamadığı durum
  if (!tours || tours.length === 0) {
    return (
      <div className="bg-blue-50 p-8 rounded-md text-center">
        <p className="text-lg text-blue-700 mb-2">
          {emptyMessage || t('tours.noToursFound', 'Tur bulunamadı')}
        </p>
        <p className="text-gray-600">
          {t('tours.tryDifferentFilters', 'Lütfen farklı filtreler deneyin veya tüm turları görüntüleyin.')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard 
          key={tour.id} 
          tour={tour} 
          getCategoryLabel={getCategoryLabel}
        />
      ))}
    </div>
  );
};

export default TourList; 
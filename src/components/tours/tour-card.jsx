import { useTranslation } from 'react-i18next';
import { Card, Button } from '../ui';

// TourCard bileşeni - Tur listesinde her bir turu gösteren kart
const TourCard = ({ tour, getCategoryLabel }) => {
  const { t } = useTranslation();

  // Fiyat formatı
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className="h-full flex flex-col"
      image={tour.image}
      imageAlt={tour.title}
      title={tour.title}
      subtitle={getCategoryLabel ? getCategoryLabel(tour.category) : tour.category}
      hoverEffect={true}
    >
      <div className="p-4 pt-0 flex flex-col flex-grow">
        {/* Açıklama */}
        <p className="text-gray-600 mb-4">{tour.description}</p>
        
        {/* Tur Özellikleri */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tour.features && tour.features.map((feature, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          {/* Fiyat ve Grup Boyutu */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(tour.pricePerPerson)}
              <span className="text-sm font-normal text-gray-500"> / {t('tours.perPerson', 'kişi başı')}</span>
            </span>
            <span className="text-sm text-gray-500">
              {t('tours.groupSize', 'Grup')}: {tour.groupSize} {t('tours.people', 'kişi')}
            </span>
          </div>
          
          {/* Detay Butonu */}
          <Button 
            to={`/turlar/${tour.slug}`}
            variant="primary"
            fullWidth
          >
            {t('buttons.details', 'Detayları Gör')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TourCard; 
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Select, Button } from '../ui';

// TourFilter bileşeni - Turları filtrelemek için kullanılacak form bileşeni
const TourFilter = ({ onFilter, initialFilters = {}, className = '' }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtre state'i
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    duration: initialFilters.duration || '',
    groupSize: initialFilters.groupSize || '',
    ...initialFilters
  });

  // Kategori verilerini yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Şu an JSON dosyasından veri çekiyoruz, ileride API'dan çekilecek
        const response = await fetch('data/categories.json');
        if (!response.ok) {
          throw new Error('Kategori verileri yüklenemedi');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Kategori verisi yüklenirken hata:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Form verilerini güncelle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtreleri temizle
  const handleReset = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      duration: '',
      groupSize: ''
    });
    onFilter({});
  };

  // Filtreleri uygula
  const handleSubmit = (e) => {
    e.preventDefault();
    // Boş değerleri filtreleme
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onFilter(nonEmptyFilters);
  };

  // Tur süre seçenekleri
  const durationOptions = [
    { value: '', label: t('filters.anyDuration', 'Herhangi bir süre') },
    { value: '1-3', label: '1-3 ' + t('filters.days', 'gün') },
    { value: '4-7', label: '4-7 ' + t('filters.days', 'gün') },
    { value: '8-14', label: '8-14 ' + t('filters.days', 'gün') },
    { value: '15+', label: '15+ ' + t('filters.days', 'gün') }
  ];

  // Grup boyutu seçenekleri
  const groupSizeOptions = [
    { value: '', label: t('filters.anyGroupSize', 'Herhangi bir grup boyutu') },
    { value: '1-2', label: '1-2 ' + t('filters.people', 'kişi') },
    { value: '3-5', label: '3-5 ' + t('filters.people', 'kişi') },
    { value: '6-10', label: '6-10 ' + t('filters.people', 'kişi') },
    { value: '11+', label: '11+ ' + t('filters.people', 'kişi') }
  ];

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{t('tours.filterTitle', 'Turları Filtrele')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kategori Filtresi */}
        <Select
          name="category"
          label={t('filters.category', 'Kategori')}
          value={filters.category}
          onChange={handleChange}
          options={[
            { value: '', label: t('filters.allCategories', 'Tüm Kategoriler') },
            ...(categories.map(cat => ({ value: cat.key, label: cat.label })))
          ]}
          placeholder={t('filters.selectCategory', 'Kategori Seçin')}
          disabled={loading}
        />
        
        {/* Fiyat Aralığı */}
        <div className="grid grid-cols-2 gap-2">
          <Input
            name="priceMin"
            label={t('filters.minPrice', 'Min. Fiyat')}
            type="number"
            value={filters.priceMin}
            onChange={handleChange}
            placeholder="₺"
          />
          <Input
            name="priceMax"
            label={t('filters.maxPrice', 'Max. Fiyat')}
            type="number"
            value={filters.priceMax}
            onChange={handleChange}
            placeholder="₺"
          />
        </div>
        
        {/* Tur Süresi */}
        <Select
          name="duration"
          label={t('filters.duration', 'Tur Süresi')}
          value={filters.duration}
          onChange={handleChange}
          options={durationOptions}
        />
        
        {/* Grup Boyutu */}
        <Select
          name="groupSize"
          label={t('filters.groupSize', 'Grup Boyutu')}
          value={filters.groupSize}
          onChange={handleChange}
          options={groupSizeOptions}
        />
        
        {/* Butonlar */}
        <div className="flex space-x-2 pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
          >
            {t('buttons.applyFilters', 'Filtreleri Uygula')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            {t('buttons.reset', 'Sıfırla')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TourFilter; 
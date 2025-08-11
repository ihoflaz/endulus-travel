/**
 * Fiyat formatlama utility fonksiyonları
 */

// Para birimi tercihi (varsayılan: orijinal para birimi)
let CURRENCY_PREFERENCE = 'original'; // 'original', 'tl', 'usd' seçenekleri

// Güncel döviz kurları (örnek)
const EXCHANGE_RATES = {
  USD_TO_TRY: 29.5,
  EUR_TO_TRY: 32.0,
  TRY_TO_USD: 1/29.5,
  TRY_TO_EUR: 1/32.0
};

/**
 * Para birimi tercihini ayarlar
 * @param {string} preference - 'original', 'tl', 'usd'
 */
export const setCurrencyPreference = (preference) => {
  CURRENCY_PREFERENCE = preference;
};

/**
 * Fiyatı belirtilen para birimine çevirir
 * @param {number} amount - Miktar
 * @param {string} fromCurrency - Kaynak para birimi
 * @param {string} toCurrency - Hedef para birimi
 * @returns {number} Çevrilmiş miktar
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  const key = `${fromCurrency}_TO_${toCurrency}`;
  const rate = EXCHANGE_RATES[key];
  
  if (rate) {
    return Math.round(amount * rate);
  }
  
  return amount;
};

/**
 * Tur fiyatını formatlayarak görüntüler
 * @param {Object} tour - Tur bilgileri
 * @param {string} [locale='tr-TR'] - Dil locale'u
 * @param {string} [preferredCurrency='original'] - Tercih edilen para birimi
 * @returns {string} Formatlanmış fiyat metni
 */
export const formatTourPrice = (tour, locale = 'tr-TR', preferredCurrency = 'original') => {
  // Eğer originalPrice ve currency varsa, bunları öncelikle kullan
  if (tour.originalPrice && tour.currency) {
    if (preferredCurrency === 'original' || preferredCurrency === tour.currency.toLowerCase()) {
      if (tour.currency === 'USD') {
        return `${tour.originalPrice} USD`;
      } else if (tour.currency === 'EUR') {
        return `${tour.originalPrice} EUR`;
      }
    } else if (preferredCurrency === 'tl') {
      // Orijinal para birimini TL'ye çevir
      const convertedAmount = convertCurrency(tour.originalPrice, tour.currency, 'TRY');
      return `${convertedAmount.toLocaleString(locale)} ₺`;
    }
  }

  // Eğer pricePerPerson varsa TL olarak göster
  if (tour.pricePerPerson) {
    if (preferredCurrency === 'usd' && tour.currency !== 'USD') {
      // TL'yi USD'ye çevir
      const convertedAmount = convertCurrency(tour.pricePerPerson, 'TRY', 'USD');
      return `${convertedAmount} USD`;
    } else {
      return `${tour.pricePerPerson.toLocaleString(locale)} ₺`;
    }
  }

  // Eğer priceStatus varsa onu göster
  if (tour.priceStatus) {
    return tour.priceStatus;
  }

  // Varsayılan metin
  return 'Fiyat Bilgisi Yok';
};

/**
 * Fiyat labelını döndürür
 * @param {Object} tour - Tur bilgileri
 * @returns {string} Fiyat label'ı
 */
export const getPriceLabel = (tour) => {
  // Eğer originalPrice ve currency varsa
  if (tour.originalPrice && tour.currency) {
    return 'Kişi Başı';
  }

  // Eğer pricePerPerson varsa
  if (tour.pricePerPerson) {
    return 'Kişi Başı';
  }

  // Eğer priceStatus varsa
  if (tour.priceStatus) {
    return 'Durum';
  }

  return 'Fiyat';
};

/**
 * Tur için fiyat varlığını kontrol eder
 * @param {Object} tour - Tur bilgileri
 * @returns {boolean} Fiyat bilgisi var mı?
 */
export const hasPriceInfo = (tour) => {
  return !!(tour.priceNote || 
           (tour.originalPrice && tour.currency) || 
           tour.pricePerPerson || 
           tour.priceStatus);
};

/**
 * Filtreleme için numerik fiyat değerini döndürür
 * @param {Object} tour - Tur bilgileri
 * @returns {number|null} Numerik fiyat değeri (TL cinsinden)
 */
export const getNumericPrice = (tour) => {
  // pricePerPerson varsa direkt kullan
  if (tour.pricePerPerson) {
    return tour.pricePerPerson;
  }

  // originalPrice varsa TL'ye çevir (yaklaşık kur: 1 USD = 29 TL)
  if (tour.originalPrice && tour.currency) {
    if (tour.currency === 'USD') {
      return tour.originalPrice * 29; // Güncel kurla çarpan
    } else if (tour.currency === 'EUR') {
      return tour.originalPrice * 32; // EUR kuru
    }
  }

  return null;
};

/**
 * Tur fiyatını kampanya ile birlikte formatlayarak görüntüler
 * @param {Object} tour - Tur bilgileri
 * @returns {Object} Formatlanmış fiyat bilgileri (currentPrice, originalPrice, hasDiscount)
 */
export const formatTourPriceWithDiscount = (tour) => {
  const result = {
    currentPrice: null,
    originalPrice: null,
    hasDiscount: false,
    currency: null
  };

  // Kampanya fiyatı kontrolü
  if (tour.specialOffer && tour.pricePerPerson && tour.originalPrice && tour.currency) {
    result.currentPrice = `${tour.pricePerPerson} ${tour.currency}`;
    result.originalPrice = `${tour.originalPrice} ${tour.currency}`;
    result.hasDiscount = true;
    result.currency = tour.currency;
  } else if (tour.originalPrice && tour.currency) {
    result.currentPrice = `${tour.originalPrice} ${tour.currency}`;
    result.currency = tour.currency;
  } else if (tour.pricePerPerson) {
    result.currentPrice = `${tour.pricePerPerson.toLocaleString('tr-TR')} ₺`;
    result.currency = 'TRY';
  } else if (tour.priceStatus) {
    result.currentPrice = tour.priceStatus;
  } else {
    result.currentPrice = 'Fiyat Bilgisi Yok';
  }

  return result;
};

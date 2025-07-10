import React, { createContext, useContext, useState } from 'react';

// Para birimi context'i
const CurrencyContext = createContext();

// Para birimi sağlayıcı
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('original'); // 'original', 'tl', 'usd'
  const [showBothCurrencies, setShowBothCurrencies] = useState(false);

  const value = {
    currency,
    setCurrency,
    showBothCurrencies,
    setShowBothCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Para birimi hook'u
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;

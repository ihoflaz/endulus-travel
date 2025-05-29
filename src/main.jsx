import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'  // Tema CSS'ini ekliyorum
import App from './App.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js' // i18n desteği için gerekli konfigürasyon

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
    <App />
    </I18nextProvider>
  </StrictMode>,
)

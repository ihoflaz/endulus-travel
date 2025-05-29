import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/main-layout';
import HomePage from './pages/home-page';
import ToursPage from './pages/tours-page';
import TourDetailPage from './pages/tour-detail-page';
import ContactPage from './pages/contact-page';
import SurveyPage from './pages/survey-page';
import RequestOfferPage from './pages/request-offer-page';
import TourPlanningPage from './pages/tour-planning-page';
import BudgetRoutesPage from './pages/budget-routes-page';
import BlogPage from './pages/blog-page';
import BlogDetailPage from './pages/blog-detail-page';
import AboutPage from './pages/about-page';
import ServicesPage from './pages/services-page';
import ServiceDetailPage from './pages/service-detail-page';
import ScrollToTop from './components/utils/scroll-to-top';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Ana Sayfa */}
          <Route index element={<HomePage />} />
          
          {/* Diğer Sayfalar */}
          <Route path="/turlar" element={<ToursPage />} />
          <Route path="/turlar/:slug" element={<TourDetailPage />} />
          <Route path="/tur-planlama" element={<TourPlanningPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/butceye-gore-rota" element={<BudgetRoutesPage />} />
          <Route path="/on-anket" element={<SurveyPage />} />
          <Route path="/teklif-al" element={<RequestOfferPage />} />
          <Route path="/hizmetler" element={<ServicesPage />} />
          <Route path="/hizmetler/:id" element={<ServiceDetailPage />} />
          
          {/* 404 Sayfası */}
          <Route path="*" element={<div className="py-20 text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-xl">Sayfa Bulunamadı</p>
          </div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
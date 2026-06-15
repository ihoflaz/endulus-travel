import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import LocaleLayout from './components/utils/LocaleLayout';
import { LOCALES, ROUTE_SEGMENTS, localizedPath, stripLocale, detectLocale } from './utils/locale-routes';
import HomePage from './pages/home-page';
import ToursPage from './pages/tours-page';
import DomesticToursPage from './pages/domestic-tours-page';
import InternationalToursPage from './pages/international-tours-page';
import TourDetailPage from './pages/tour-detail-page-new';
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
import { PrivacyPage, TermsPage, KvkkPage } from './pages/legal-page';
import ScrollToTop from './components/utils/scroll-to-top';
import PageViewTracker from './components/utils/PageViewTracker';
import SmoothScroll from './components/motion/SmoothScroll';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import AdminLayoutBase from './components/admin/AdminLayout';
import LoginPage from './pages/admin/login';

// Admin pages are lazy-loaded so the public bundle stays small.
const DashboardPage = lazy(() => import('./pages/admin/dashboard'));
const AdminTours = lazy(() => import('./pages/admin/tours'));
const AdminBlog = lazy(() => import('./pages/admin/blog'));
const AdminServices = lazy(() => import('./pages/admin/services'));
const AdminWomenGroups = lazy(() => import('./pages/admin/women-groups'));
const AdminHero = lazy(() => import('./pages/admin/hero'));
const AdminCategories = lazy(() => import('./pages/admin/categories'));
const AdminFormOptions = lazy(() => import('./pages/admin/form-options'));
const AdminBudgetRoutes = lazy(() => import('./pages/admin/budget-routes'));
const AdminTourWizard = lazy(() => import('./pages/admin/tour-wizard'));
const AdminAbout = lazy(() => import('./pages/admin/about'));
const AdminContact = lazy(() => import('./pages/admin/contact'));
const AdminUsers = lazy(() => import('./pages/admin/users'));
const AdminMedia = lazy(() => import('./pages/admin/media'));
const AdminMessages = lazy(() => import('./pages/admin/messages'));
const AdminReviews = lazy(() => import('./pages/admin/reviews'));
const AdminAudit = lazy(() => import('./pages/admin/audit'));
const AdminProfile = lazy(() => import('./pages/admin/profile'));
const AdminSite = lazy(() => import('./pages/admin/site'));
const AdminLegal = lazy(() => import('./pages/admin/legal'));

const AdminFallback = (
  <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
    Yükleniyor…
  </div>
);

const AdminLayout = () => (
  <Suspense fallback={AdminFallback}>
    <AdminLayoutBase />
  </Suspense>
);

// Public page element per route key + the slug/id detail routes.
const PAGE_EL = {
  tours: <ToursPage />,
  domestic: <DomesticToursPage />,
  international: <InternationalToursPage />,
  planning: <TourPlanningPage />,
  blog: <BlogPage />,
  about: <AboutPage />,
  contact: <ContactPage />,
  budget: <BudgetRoutesPage />,
  survey: <SurveyPage />,
  offer: <RequestOfferPage />,
  services: <ServicesPage />,
  privacy: <PrivacyPage />,
  terms: <TermsPage />,
  kvkk: <KvkkPage />,
};
const DETAIL_ROUTES = [
  { key: 'tours', child: ':slug', element: <TourDetailPage /> },
  { key: 'blog', child: ':slug', element: <BlogDetailPage /> },
  { key: 'services', child: ':id', element: <ServiceDetailPage /> },
];

const NotFound = () => (
  <div className="py-20 text-center">
    <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
    <p className="text-xl">Sayfa Bulunamadı / Page Not Found</p>
  </div>
);

// Child routes for one locale, with that locale's translated segments.
const localeChildren = (lang) => {
  const segOf = (key) => ROUTE_SEGMENTS.find((r) => r.key === key)[lang];
  return [
    <Route key="index" index element={<HomePage />} />,
    ...ROUTE_SEGMENTS.map((r) => (
      <Route key={r.key} path={r[lang]} element={PAGE_EL[r.key]} />
    )),
    ...DETAIL_ROUTES.map((d) => (
      <Route key={`${d.key}-detail`} path={`${segOf(d.key)}/${d.child}`} element={d.element} />
    )),
    <Route key="nf" path="*" element={<NotFound />} />,
  ];
};

// "/" -> detected locale home. Old unprefixed paths (/turlar, /tours) -> the
// translated, locale-prefixed equivalent (301-style replace) so existing links,
// bookmarks and indexed URLs keep working.
const RootRedirect = () => <Navigate to={`/${detectLocale()}`} replace />;
const LegacyRedirect = () => {
  const { pathname, search } = useLocation();
  return <Navigate to={localizedPath(stripLocale(pathname) || '/', detectLocale()) + search} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SmoothScroll>
        <ScrollToTop />
        <PageViewTracker />
        <Routes>
          {/* --- Admin --- */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="women-groups" element={<AdminWomenGroups />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="form-options" element={<AdminFormOptions />} />
            <Route path="budget-routes" element={<AdminBudgetRoutes />} />
            <Route path="tour-wizard" element={<AdminTourWizard />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="site" element={<AdminSite />} />
            <Route path="legal" element={<AdminLegal />} />
            <Route path="media" element={<AdminMedia />} />
            <Route
              path="users"
              element={
                <ProtectedRoute minRole="ADMIN">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="audit"
              element={
                <ProtectedRoute minRole="ADMIN">
                  <AdminAudit />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* --- Public (locale-prefixed: /tr, /en) --- */}
          <Route path="/" element={<RootRedirect />} />
          {LOCALES.map((lang) => (
            <Route key={lang} path={`/${lang}`} element={<LocaleLayout lang={lang} />}>
              {localeChildren(lang)}
            </Route>
          ))}
          {/* Old unprefixed URLs -> translated, locale-prefixed equivalents */}
          <Route path="*" element={<LegacyRedirect />} />
        </Routes>
        </SmoothScroll>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useReveal } from './hooks/use-reveal';
import { ScrollToTop } from './components/common/scroll-to-top';
import { SiteNav } from './components/landing/site-nav';
import { SiteFooter } from './components/landing/sections';
import { Toaster } from 'sonner';
import { SmoothScrollProvider } from './lib/lenis-scroll';
import { ThemeProvider } from './lib/theme';
import { CurrencyProvider } from './lib/currency-context';

// Public Pages
import HomePage from './pages/home-page';
import ServicesPage from './pages/services-page';
import WhyUsPage from './pages/why-us-page';
import ProcessPage from './pages/process-page';
import WorkPage from './pages/work-page';
import PricingPage from './pages/pricing-page';
import FaqPage from './pages/faq-page';
import ContactPage from './pages/contact-page';

// Admin Pages & Auth
import AdminLoginPage from './pages/admin/admin-login-page';
import AdminDashboardPage from './pages/admin/admin-dashboard-page';
import AdminInquiriesPage from './pages/admin/admin-inquiries-page';
import AdminClientsPage from './pages/admin/admin-clients-page';
import AdminQuotationsPage from './pages/admin/admin-quotations-page';
import { AdminProtectedRoute } from './lib/admin-auth';

import { ChatBot } from './components/chat/chat-bot';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminPortal = isAdminRoute && location.pathname !== '/admin/login';

  return (
    <div
      className={`max-w-full bg-background text-foreground flex flex-col selection:bg-butter selection:text-butter-foreground ${
        isAdminPortal ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-clip'
      }`}
      {...(isAdminPortal ? { 'data-lenis-prevent': 'true' } : {})}
    >
      {/* Route change scroll-to-top handler */}
      <ScrollToTop />

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />

      {/* Global AI Chatbot Concierge (public routes only) */}
      {!isAdminRoute && <ChatBot />}

      {/* Global Pill Navbar (public routes only) */}
      {!isAdminRoute && <SiteNav />}

      {/* Dynamic Route View */}
      <main className={`flex-1 flex flex-col ${isAdminPortal ? 'h-full overflow-hidden' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/why" element={<WhyUsPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <AdminProtectedRoute>
                <AdminInquiriesPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <AdminProtectedRoute>
                <AdminClientsPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/quotations"
            element={
              <AdminProtectedRoute>
                <AdminQuotationsPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Global Footer (public routes only) */}
      {!isAdminRoute && <SiteFooter />}
    </div>
  );
}

export function App() {
  // Initialize scroll reveal observer
  useReveal();

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <SmoothScrollProvider>
            <AppContent />
          </SmoothScrollProvider>
        </BrowserRouter>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;


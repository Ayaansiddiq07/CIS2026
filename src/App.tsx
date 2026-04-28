import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout.tsx';

const Home = lazy(() => import('./pages/Home.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Events = lazy(() => import('./pages/Events.tsx'));
const Sessions = lazy(() => import('./pages/Sessions.tsx'));
const Speakers = lazy(() => import('./pages/Speakers.tsx'));
const Partners = lazy(() => import('./pages/Partners.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const FAQ = lazy(() => import('./pages/FAQ.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.tsx'));
const AdminLayout = lazy(() => import('./components/AdminLayout.tsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.tsx'));
const AdminSiteContent = lazy(() => import('./pages/admin/AdminSiteContent.tsx'));
const AdminSpeakers = lazy(() => import('./pages/admin/AdminSpeakers.tsx'));
const AdminSponsors = lazy(() => import('./pages/admin/AdminSponsors.tsx'));
const AdminRegistrations = lazy(() => import('./pages/admin/AdminRegistrations.tsx'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts.tsx'));

/** Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Loading spinner */
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-banky-border border-t-banky-blue rounded-full animate-spin" />
        <span className="font-display text-[12px] font-semibold text-banky-dark/40 uppercase tracking-[0.15em]">Loading</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="site-content" element={<AdminSiteContent />} />
            <Route path="speakers" element={<AdminSpeakers />} />
            <Route path="sponsors" element={<AdminSponsors />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui';
import './assets/css/global.css';
import './assets/css/admin.css';

// ── Analytics tracker ────────────────────────────────────────────────────────
import { trackPageView } from './services/adminService';

// ── Common components ────────────────────────────────────────────────────────
import Header      from './components/common/Header';
import Footer      from './components/common/Footer';
import WhatsAppCta from './components/common/WhatsAppCta';

// ── Public pages ─────────────────────────────────────────────────────────────
// Home stays eager (it's the most common landing route); everything else
// splits into its own chunk so first paint doesn't pay for pages the visitor
// may never open — including the entire admin panel, which used to ship
// inside the main bundle for every public visitor.
import HomePage          from './pages/HomePage';
const ServicesPage       = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage  = lazy(() => import('./pages/ServiceDetailPage'));
const BlogPage           = lazy(() => import('./pages/BlogPage'));
const BlogPostPage       = lazy(() => import('./pages/BlogPostPage'));
const AboutPage          = lazy(() => import('./pages/AboutPage'));
const ContactPage        = lazy(() => import('./pages/ContactPage'));
const ApplyPage          = lazy(() => import('./pages/ApplyPage'));
const PortfolioPage      = lazy(() => import('./pages/PortfolioPage'));
const TeamPage           = lazy(() => import('./pages/TeamPage'));
const FAQPage            = lazy(() => import('./pages/FAQPage'));
const PrivacyPage        = lazy(() => import('./pages/PrivacyPage'));
const TermsPage          = lazy(() => import('./pages/TermsPage'));
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'));
const AIToolsPage        = lazy(() => import('./pages/AIToolsPage'));
const StyleguidePage     = lazy(() => import('./pages/StyleguidePage'));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLogin         = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMessages      = lazy(() => import('./pages/admin/AdminMessages'));
const AdminApplications  = lazy(() => import('./pages/admin/AdminApplications'));
const AdminServices      = lazy(() => import('./pages/admin/AdminServices'));
const AdminBlog          = lazy(() => import('./pages/admin/AdminBlog'));
const AdminFAQs          = lazy(() => import('./pages/admin/AdminFAQs'));
const AdminAnalytics     = lazy(() => import('./pages/admin/AdminAnalytics'));
import ProtectedRoute    from './components/admin/ProtectedRoute';

const queryClient = new QueryClient();

// ── Session ID (persisted for this browser session) ───────────────────────────
function getSessionId() {
    let id = sessionStorage.getItem('jr_sid');
    if (!id) {
        id = Math.random().toString(36).slice(2);
        sessionStorage.setItem('jr_sid', id);
    }
    return id;
}

// ── Page tracker component ────────────────────────────────────────────────────
function PageTracker() {
    const location = useLocation();
    const prevPath = useRef('');

    useEffect(() => {
        // Don't track admin pages
        if (location.pathname.startsWith('/admin')) return;
        // Don't double-track same path
        if (location.pathname === prevPath.current) return;
        prevPath.current = location.pathname;

        trackPageView(
            location.pathname,
            getSessionId(),
            document.referrer || '',
        );

        // Google Analytics (GA4) — only fires if GA_ID is set
        const GA_ID = import.meta.env.VITE_GA_ID;
        if (GA_ID && window.gtag) {
            window.gtag('config', GA_ID, { page_path: location.pathname });
        }
    }, [location.pathname]);

    return null;
}

// ── Google Analytics loader ───────────────────────────────────────────────────
function GoogleAnalytics() {
    const GA_ID = import.meta.env.VITE_GA_ID;
    useEffect(() => {
        if (!GA_ID) return;
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', GA_ID, { anonymize_ip: true });
        };
    }, [GA_ID]);
    return null;
}

// ── Layout wrapper — hides nav/footer on /admin/* ────────────────────────────
function PublicLayout({ children }) {
    const location = useLocation();
    const isAdmin  = location.pathname.startsWith('/admin');
    return (
        <>
            {!isAdmin && <Header />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppCta />}
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <GoogleAnalytics />
                <PageTracker />
                <PublicLayout>
                    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
                    <Routes>
                        {/* ── Public ── */}
                        <Route path="/"              element={<HomePage />} />
                        <Route path="/services"      element={<ServicesPage />} />
                        <Route path="/services/:id"  element={<ServiceDetailPage />} />
                        <Route path="/blog"          element={<BlogPage />} />
                        <Route path="/blog/:slug"    element={<BlogPostPage />} />
                        <Route path="/about"         element={<AboutPage />} />
                        <Route path="/contact"       element={<ContactPage />} />
                        <Route path="/apply"         element={<ApplyPage />} />
                        <Route path="/portfolio"     element={<PortfolioPage />} />
                        <Route path="/team"          element={<TeamPage />} />
                        <Route path="/faq"           element={<FAQPage />} />
                        <Route path="/ai-tools"      element={<AIToolsPage />} />
                        <Route path="/terms"         element={<TermsPage />} />
                        <Route path="/privacy"       element={<PrivacyPage />} />
                        <Route path="/styleguide"    element={<StyleguidePage />} />

                        {/* ── Admin ── */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard"    element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/messages"     element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
                        <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
                        <Route path="/admin/services"     element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
                        <Route path="/admin/blog"         element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
                        <Route path="/admin/faqs"         element={<ProtectedRoute><AdminFAQs /></ProtectedRoute>} />
                        <Route path="/admin/analytics"    element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
                        <Route path="/admin"              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    </Suspense>
                </PublicLayout>
            </Router>
            </ToastProvider>
        </QueryClientProvider>
    );
}

export default App;

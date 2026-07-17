import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './assets/css/global.css';
import './assets/css/admin.css';

// ── Analytics tracker ────────────────────────────────────────────────────────
import { trackPageView } from './services/adminService';

// ── Common components ────────────────────────────────────────────────────────
import Header  from './components/common/Header';
import Footer  from './components/common/Footer';
import Chatbot from './components/Chatbot';

// ── Public pages ─────────────────────────────────────────────────────────────
import HomePage         from './pages/HomePage';
import ServicesPage     from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BlogPage         from './pages/BlogPage';
import BlogPostPage     from './pages/BlogPostPage';
import AboutPage        from './pages/AboutPage';
import ContactPage      from './pages/ContactPage';
import ApplyPage        from './pages/ApplyPage';
import PortfolioPage    from './pages/PortfolioPage';
import TeamPage         from './pages/TeamPage';
import FAQPage          from './pages/FAQPage';
import PrivacyPage      from './pages/PrivacyPage';
import TermsPage        from './pages/TermsPage';
import NotFoundPage     from './pages/NotFoundPage';
import AIToolsPage      from './pages/AIToolsPage';

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminLogin        from './pages/admin/AdminLogin';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminMessages     from './pages/admin/AdminMessages';
import AdminApplications from './pages/admin/AdminApplications';
import AdminServices     from './pages/admin/AdminServices';
import AdminAnalytics    from './pages/admin/AdminAnalytics';
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
        const GA_ID = process.env.REACT_APP_GA_ID;
        if (GA_ID && window.gtag) {
            window.gtag('config', GA_ID, { page_path: location.pathname });
        }
    }, [location.pathname]);

    return null;
}

// ── Google Analytics loader ───────────────────────────────────────────────────
function GoogleAnalytics() {
    const GA_ID = process.env.REACT_APP_GA_ID;
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
            {!isAdmin && <Chatbot />}
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <GoogleAnalytics />
                <PageTracker />
                <PublicLayout>
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

                        {/* ── Admin ── */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard"    element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/messages"     element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
                        <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
                        <Route path="/admin/services"     element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
                        <Route path="/admin/analytics"    element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
                        <Route path="/admin"              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </PublicLayout>
            </Router>
        </QueryClientProvider>
    );
}

export default App;

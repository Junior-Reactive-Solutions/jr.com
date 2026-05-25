import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

// ── SVG fallback (renders if logo192.png fails to load) ──────────
const JRLogoSVG = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="jrGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5269c3" />
                <stop offset="100%" stopColor="#90a0da" />
            </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill="url(#jrGrad)" />
        <path d="M11 10h5v14c0 3-1.5 5-5 5l-1-3c1.5 0 1-1 1-2V10z" fill="white" />
        <path d="M20 10h6c3 0 5 2 5 5s-1.5 4-3.5 4.5L31 30h-4.5l-3-10H24v10h-4V10z M24 13v4h2c1 0 1.5-.5 1.5-2s-.5-2-1.5-2h-2z" fill="white" />
    </svg>
);

// ── Logo: real image with SVG fallback ───────────────────────────
const JRLogo = ({ size = 36 }) => {
    const [imgOk, setImgOk] = React.useState(true);
    return imgOk ? (
        <img
            src="/logo192.png"
            alt="Junior Reactive"
            width={size}
            height={size}
            style={{ borderRadius: 8, objectFit: 'contain' }}
            onError={() => setImgOk(false)}
        />
    ) : (
        <JRLogoSVG size={size} />
    );
};

const NAV_LINKS = [
    { to: '/',          label: 'Home',       exact: true },
    { to: '/services',  label: 'Services'    },
    { to: '/about',     label: 'About'       },
    { to: '/portfolio', label: 'Portfolio'   },
    { to: '/ai-tools',  label: 'AI Tools'    },
    { to: '/blog',      label: 'Blog'        },
    { to: '/contact',   label: 'Contact'     },
];

const Navbar = () => {
    const [scrolled,  setScrolled]  = useState(false);
    const [menuOpen,  setMenuOpen]  = useState(false);
    const location = useLocation();

    // close menu on route change
    useEffect(() => { setMenuOpen(false); }, [location]);

    // lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 20);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleLinkClick = () => {
        setMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <header className={scrolled ? 'scrolled' : ''}>
                <div className="container nav-container">

                    {/* ── Brand ─────────────────────────────────── */}
                    <Link to="/" className="nav-brand" onClick={handleLinkClick}>
                        <JRLogo size={34} />
                        <span className="nav-brand-text">
                            <span className="brand-j">J</span><span className="brand-full brand-full-j">unior</span>
                            <span className="brand-r"> R</span><span className="brand-full brand-full-r">eactive</span>
                        </span>
                    </Link>

                    {/* ── Desktop links ─────────────────────────── */}
                    <nav className="nav-links" aria-label="Main navigation">
                        {NAV_LINKS.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.exact}
                                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* ── Desktop CTA ───────────────────────────── */}
                    <Link to="/apply" className="btn nav-cta" onClick={handleLinkClick}>
                        Apply Now
                    </Link>

                    {/* ── Hamburger ─────────────────────────────── */}
                    <button
                        className={`hamburger${menuOpen ? ' open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </header>

            {/* ── Mobile overlay ──────────────────────────────── */}
            <div
                className={`mobile-overlay${menuOpen ? ' open' : ''}`}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
            />

            {/* ── Mobile drawer ───────────────────────────────── */}
            <nav className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation">
                <div className="mobile-nav-header">
                    <Link to="/" className="nav-brand" onClick={handleLinkClick}>
                        <JRLogo size={30} />
                        <span className="nav-brand-text" style={{ color: 'white' }}>
                            <span className="brand-j">Junior</span>
                            {' '}
                            <span className="brand-r">Reactive</span>
                        </span>
                    </Link>
                    <button
                        className="mobile-close"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <div className="mobile-nav-links">
                    {NAV_LINKS.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.exact}
                            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="mobile-nav-footer">
                    <Link to="/apply" className="btn btn-full-width" onClick={handleLinkClick}>
                        Apply for Services
                    </Link>
                    <Link to="/contact" className="btn btn-outline btn-full-width" onClick={handleLinkClick}>
                        Contact Us
                    </Link>
                    <div className="mobile-nav-contact">
                        <a href="tel:+256764524816">+256 764 524 816</a>
                        <a href="mailto:juniorreactive@gmail.com">juniorreactive@gmail.com</a>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
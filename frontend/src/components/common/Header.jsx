import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={scrolled ? 'scrolled' : ''}>
            <div className="container nav-container">
                <Link to="/" className="logo-link" onClick={closeMenu}>
                    <img src="/logo.png" alt="Junior Reactive Logo" className="logo-img" />
                    <div className="logo-text">
                        Junior <span>Reactive</span>
                    </div>
                </Link>

                <button
                    className={`mobile-menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span /><span /><span />
                </button>

                <nav className={menuOpen ? 'open' : ''}>
                    <ul>
                        <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
                        <li><NavLink to="/services" onClick={closeMenu}>Services</NavLink></li>
                        <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
                        <li><NavLink to="/portfolio" onClick={closeMenu}>Portfolio</NavLink></li>
                        <li><NavLink to="/blog" onClick={closeMenu}>Blog</NavLink></li>
                        <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
                    </ul>
                    <Link to="/apply" className="btn-nav" onClick={closeMenu}>
                        Get Started
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../assets/icons/components/Icon';

const contactLinkStyle = { color: 'rgba(255,255,255,.55)', display: 'inline-flex', alignItems: 'center', gap: 8 };

// Inline SVGs replace the Font Awesome CDN stylesheet, which was loaded
// sitewide for these 3 glyphs alone.
const SocialIcon = ({ d }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);
const SOCIAL_ICONS = {
    whatsapp: 'M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.5-.3zM12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2z',
    instagram: 'M12 2c2.7 0 3.1 0 4.1.1 1 0 1.7.2 2.3.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.3.6.4 1.3.5 2.3.1 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1-.2 1.7-.5 2.3-.2.6-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.3-1.3.4-2.3.5-1 .1-1.4.1-4.1.1s-3.1 0-4.1-.1c-1 0-1.7-.2-2.3-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.3-.6-.4-1.3-.5-2.3-.1-1-.1-1.4-.1-4.1s0-3.1.1-4.1c0-1 .2-1.7.5-2.3.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2.3-.5C8.9 2 9.3 2 12 2zm0 1.8c-2.6 0-3 0-4 .1-.8 0-1.3.2-1.6.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.6-.1 1-.1 1.4-.1 4s0 3 .1 4c0 .8.2 1.3.3 1.6.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.6.3 1 .1 1.4.1 4 .1s3 0 4-.1c.8 0 1.3-.2 1.6-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.6.1-1 .1-1.4.1-4s0-3-.1-4c0-.8-.2-1.3-.3-1.6-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.6-.3-1-.1-1.4-.1-4-.1zm0 3.5a4.7 4.7 0 110 9.4 4.7 4.7 0 010-9.4zm0 1.8a2.9 2.9 0 100 5.8 2.9 2.9 0 000-5.8zm5.9-2a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z',
    tiktok: 'M16.6 5.8a4.9 4.9 0 01-1-2.9h-3v13.4a2.8 2.8 0 11-2-2.7v-3a5.8 5.8 0 105.8 5.8V9.5a7.9 7.9 0 004.6 1.5v-3a4.9 4.9 0 01-4.4-2.2z',
};

// ScrollLink: navigates to a route AND scrolls to top
const ScrollLink = ({ to, children, ...props }) => {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return <a href={to} onClick={handleClick} {...props}>{children}</a>;
};

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer>
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <img src="/logo192.png" alt="Junior Reactive" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 6 }} onError={e => e.target.style.display = 'none'} />
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
                                Junior <span style={{ color: 'rgba(255,255,255,.45)' }}>Reactive</span>
                            </span>
                        </div>
                        <p>Practical AI and IT solutions for East African businesses. From strategy through deployment, we make technology work for you.</p>
                        <div className="social-links" style={{ marginTop: 20 }}>
                            <a href="https://wa.me/256764524816" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
                                <SocialIcon d={SOCIAL_ICONS.whatsapp} />
                            </a>
                            <a href="https://instagram.com/juniorreactive" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                <SocialIcon d={SOCIAL_ICONS.instagram} />
                            </a>
                            <a href="https://tiktok.com/@juniorreactive" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
                                <SocialIcon d={SOCIAL_ICONS.tiktok} />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="footer-col">
                        <h3>Services</h3>
                        <ul>
                            <li><ScrollLink to="/services">All Services</ScrollLink></li>
                            <li><ScrollLink to="/services/n8n-automation">N8N Automation</ScrollLink></li>
                            <li><ScrollLink to="/services/ai-consulting">AI Consulting</ScrollLink></li>
                            <li><ScrollLink to="/services/ai-courses">AI Courses</ScrollLink></li>
                            <li><ScrollLink to="/apply">Apply Now</ScrollLink></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-col">
                        <h3>Company</h3>
                        <ul>
                            <li><ScrollLink to="/about">About Us</ScrollLink></li>
                            <li><ScrollLink to="/team">Our Team</ScrollLink></li>
                            <li><ScrollLink to="/portfolio">Portfolio</ScrollLink></li>
                            <li><ScrollLink to="/blog">Blog</ScrollLink></li>
                            <li><ScrollLink to="/faq">FAQ</ScrollLink></li>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div className="footer-col">
                        <h3>Contact</h3>
                        <ul>
                            <li style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem', marginBottom: 8 }}>
                                <a href="tel:+256764524816" style={contactLinkStyle}><Icon name="phone" size="xs" /> +256 764 524 816</a>
                            </li>
                            <li style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem', marginBottom: 8 }}>
                                <a href="mailto:juniorreactive@gmail.com" style={contactLinkStyle}><Icon name="email" size="xs" /> juniorreactive@gmail.com</a>
                            </li>
                            <li style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name="location" size="xs" /> Kampala, Uganda
                            </li>
                        </ul>
                        <ul>
                            <li><ScrollLink to="/privacy">Privacy Policy</ScrollLink></li>
                            <li><ScrollLink to="/terms">Terms of Service</ScrollLink></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>© {year} Junior Reactive Ltd. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

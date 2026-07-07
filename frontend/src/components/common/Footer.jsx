import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../assets/icons/components/Icon';

const contactLinkStyle = { color: 'rgba(255,255,255,.55)', display: 'inline-flex', alignItems: 'center', gap: 8 };

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
                                <i className="fab fa-whatsapp" />
                            </a>
                            <a href="https://instagram.com/juniorreactive" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="https://tiktok.com/@juniorreactive" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
                                <i className="fab fa-tiktok" />
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

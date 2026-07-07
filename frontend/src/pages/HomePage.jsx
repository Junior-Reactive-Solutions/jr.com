import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonGrid } from '../components/common/SkeletonLoader';
import Icon from '../assets/icons/components/Icon';

const STATS = [
    { number: '50+',  label: 'Projects Delivered' },
    { number: '30+',  label: 'Happy Clients' },
    { number: '9',    label: 'Core Services' },
    { number: '100%', label: 'Client Satisfaction' },
];

const FALLBACK_SERVICES = [
    { id: 1, key: 'n8n-automation', icon: 'automation', title: 'N8N Workflow Automation',  shortDescription: 'Connect your tools and automate repetitive processes with powerful visual N8N workflows.' },
    { id: 2, key: 'ai-consulting',  icon: 'ai',         title: 'AI Consulting',              shortDescription: 'Strategic AI roadmaps that turn business challenges into intelligent, automated solutions.' },
    { id: 3, key: 'ai-courses',     icon: 'courses',    title: 'AI Courses & Training',      shortDescription: 'Structured, practical AI education programmes for individuals and corporate teams.' },
];

const WHY_US = [
    { icon: 'ai',           title: 'AI-First Approach',    desc: "Every solution we build uses the latest AI capabilities — not as a buzzword, but as genuine business value." },
    { icon: 'workflow',     title: 'End-to-End Ownership', desc: "We stay with you from strategy through deployment and beyond. Your success is our metric." },
    { icon: 'globe',        title: 'Built for Africa',     desc: "Deep understanding of East African business environments means solutions that actually work in the real world." },
];

const ServiceCard = ({ service }) => (
    <div className="card">
        <div className="card-icon"><Icon name={service.icon} size="lg" color="primary" ariaLabel={`${service.title} icon`} /></div>
        <h3 style={{ marginBottom: 10, fontSize: '1.1rem' }}>{service.title}</h3>
        <p style={{ fontSize: '.875rem', flex: 1 }}>{service.shortDescription}</p>
        <Link to={`/services/${service.key}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-secondary)', fontWeight: 700, fontSize: '.875rem', marginTop: 12 }}>
            Learn More <Icon name="arrow-right" size="xs" />
        </Link>
    </div>
);

// CEO photo with beautiful gradient-avatar fallback
const CEOPhoto = () => {
    const [imgOk, setImgOk] = React.useState(true);
    return (
        <div className="ceo-photo-wrapper">
            {imgOk ? (
                <img
                    src="/images/team/Pharrell.jpeg"
                    alt="Pharrell Aaron Mugumya — Founder & CEO"
                    className="ceo-photo"
                    onError={() => setImgOk(false)}
                />
            ) : (
                <div className="ceo-avatar-fallback">
                    <span className="ceo-avatar-initials">PM</span>
                    <span className="ceo-avatar-name">Pharrell Mugumya</span>
                    <span className="ceo-avatar-title">Founder &amp; CEO</span>
                </div>
            )}
            <div className="ceo-badge">
                <span className="ceo-badge-dot" />
                Founder &amp; CEO
            </div>
        </div>
    );
};

const HomePage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['services'],
        queryFn: () => contentService.getServices(),
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    const services = data?.data?.data || data?.data || [];
    const displayServices = services.length > 0 ? services.slice(0, 3) : FALLBACK_SERVICES;

    return (
        <main>
            <HeroSection
                badge="AI & IT Solutions · Kampala, Uganda"
                title="AI That Works For You"
                subtitle="Empowering businesses with intelligent, scalable technology solutions — from AI consulting to N8N automation and custom software."
                primaryBtnText="Explore Services"
                primaryBtnLink="/services"
                secondaryBtnText="Get in Touch"
                secondaryBtnLink="/contact"
            />

            {/* Stats */}
            <div className="container">
                <div className="stats-bar">
                    {STATS.map(s => (
                        <div className="stat-item" key={s.label}>
                            <span className="stat-number">{s.number}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">What We Do</div>
                        <h2 className="section-title">Our Core Services</h2>
                        <p className="section-sub">From strategy to deployment — end-to-end AI and IT solutions tailored to your business.</p>
                    </div>
                    {isLoading ? (
                        <SkeletonGrid count={3} />
                    ) : (
                        <>
                            {isError && (
                                <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: 24, fontSize: '.85rem', color: '#7f1d1d', display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <Icon name="warning" size="sm" color="error" ariaLabel="Warning" />
                                    <span>Could not connect to the backend. Showing default services. <button onClick={refetch} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Retry</button></span>
                                </div>
                            )}
                            <div className="services-grid">
                                {displayServices.map(s => <ServiceCard key={s.id} service={s} />)}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 40 }}>
                                <Link to="/services" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>View All 9 Services <Icon name="arrow-right" size="xs" /></Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Who We Are */}
            <section className="section" style={{ background: 'var(--color-white)' }}>
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text">
                            <div className="section-label">About Us</div>
                            <h2 style={{ marginTop: 12 }}>Bridging Technology &amp; Business</h2>
                            <p>Junior Reactive is a premier AI and IT services provider founded by Pharrell Aaron Mugumya. We make cutting-edge technology accessible and practical for businesses of all sizes.</p>
                            <p>From initial consultation to final deployment, we are your strategic technology partners — combining deep technical expertise with real-world business acumen.</p>
                            <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
                                <Link to="/about" className="btn">Meet the Team</Link>
                                <Link to="/portfolio" className="btn btn-ghost">View Portfolio</Link>
                            </div>
                        </div>
                        <CEOPhoto />
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Why Junior Reactive</div>
                        <h2 className="section-title">Built Differently</h2>
                    </div>
                    <div className="services-grid">
                        {WHY_US.map(item => (
                            <div className="card" key={item.title}>
                                <div className="card-icon"><Icon name={item.icon} size="lg" color="primary" ariaLabel={`${item.title} icon`} /></div>
                                <h3>{item.title}</h3>
                                <p style={{ fontSize: '.9rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container">
                    <div className="cta-band">
                        <h2>Ready to Transform Your Business?</h2>
                        <p>Join forward-thinking companies already leveraging our AI solutions.</p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/apply" className="btn">Apply for Services</Link>
                            <Link to="/faq" className="btn" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,.45)', color: 'white', boxShadow: 'none' }}>View FAQs</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;

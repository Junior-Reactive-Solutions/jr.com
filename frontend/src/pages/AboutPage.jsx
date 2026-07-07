import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';
import Icon from '../assets/icons/components/Icon';
import { useReveal } from '../hooks/useAnime';

const VALUES = [
    { icon: 'idea',        title: 'Innovation', desc: 'Constantly pushing the boundaries of what technology can do for your business.' },
    { icon: 'partnership', title: 'Integrity', desc: 'Transparent, honest relationships with every client — always.' },
    { icon: 'award',       title: 'Excellence', desc: 'We hold every deliverable to the highest professional standard.' },
    { icon: 'growth',      title: 'Growth', desc: 'We grow with our clients, adapting and evolving as their needs change.' },
];

const AboutPage = () => {
    const valuesRef = useReveal({ stagger: 90, y: 24 });
    return (
    <main>
        <HeroSection
            badge="Our Story"
            title="About Junior Reactive"
            subtitle="Building the future with intelligence, integrity, and an African perspective."
            primaryBtnText="Meet the Team"
            primaryBtnLink="/team"
        />

        {/* Mission */}
        <section className="section">
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                    <div>
                        <div className="section-label">Who We Are</div>
                        <h2 style={{ marginTop: 12 }}>Our Story</h2>
                        <p>
                            Founded by Pharrell Aaron Mugumya, Junior Reactive started with a simple but powerful mission: to make Artificial Intelligence accessible and effective for businesses of all sizes across East Africa and beyond.
                        </p>
                        <p>
                            We believe that technology should serve people — not the other way around. Every solution we build is grounded in real-world business needs, not theoretical frameworks.
                        </p>
                        <p>
                            From solo entrepreneurs to established organisations, we've helped clients harness the power of AI, data, and custom software to solve real problems and seize new opportunities.
                        </p>
                    </div>
                    <div style={{
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-xl)',
                        height: 380,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 16,
                        color: 'white',
                        textAlign: 'center',
                        padding: 40,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ marginBottom: 8 }}><Icon name="globe" size="xl" color="white" ariaLabel="Global reach" /></div>
                        <h3 style={{ color: 'white', margin: 0, fontFamily: 'var(--font-display)' }}>Built in Uganda,</h3>
                        <h3 style={{ color: 'rgba(255,255,255,.7)', margin: 0, fontFamily: 'var(--font-display)' }}>Built for the World</h3>
                        <p style={{ color: 'rgba(255,255,255,.7)', margin: '12px 0 0', fontSize: '0.9rem' }}>
                            Proudly headquartered in Kampala — delivering global-quality solutions.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Values */}
        <section className="section" style={{ background: 'var(--color-white)' }}>
            <div className="container">
                <div className="section-header">
                    <div className="section-label">What We Stand For</div>
                    <h2 className="section-title">Our Values</h2>
                </div>
                <div className="services-grid" ref={valuesRef}>
                    {VALUES.map((v) => (
                        <div className="card" key={v.title}>
                            <div className="card-icon"><Icon name={v.icon} size="lg" color="primary" ariaLabel={`${v.title} icon`} /></div>
                            <h3>{v.title}</h3>
                            <p style={{ fontSize: '0.9rem' }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Founder */}
        <section className="section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Leadership</div>
                    <h2 className="section-title">Meet the Founder</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="team-card" style={{ maxWidth: 360, width: '100%' }}>
                        <div className="team-img-wrap">
                            <img
                                src="/images/team/Pharrell.jpeg"
                                alt="Pharrell Aaron Mugumya"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.display = 'flex';
                                    e.target.parentElement.style.alignItems = 'center';
                                    e.target.parentElement.style.justifyContent = 'center';
                                    e.target.parentElement.innerHTML = '<span style="font-size:3rem;font-weight:800;color:#5269c3">PM</span>';
                                }}
                            />
                        </div>
                        <div className="team-card-body">
                            <h3 style={{ marginBottom: 4 }}>Pharrell Aaron Mugumya</h3>
                            <p className="position">Founder & CEO</p>
                            <p style={{ fontSize: '0.875rem' }}>
                                Passionate technologist dedicated to leveraging AI and software to create meaningful impact across African businesses.
                            </p>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Link to="/team" className="btn btn-outline">View Full Team</Link>
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="section">
            <div className="container">
                <div className="cta-band">
                    <h2>Ready to Work Together?</h2>
                    <p>Let's build something exceptional.</p>
                    <Link to="/apply" className="btn">Apply for Services</Link>
                </div>
            </div>
        </section>
    </main>
    );
};

export default AboutPage;

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import ServiceRecommender from '../components/ServiceRecommender';
import { Button, Kicker } from '../components/ui';
import Icon from '../assets/icons/components/Icon';

// Evidence figures are owner-supplied and shown without animation —
// numbers state facts; they don't perform.
const EVIDENCE = [
    { num: '50+',  label: 'Projects delivered' },
    { num: '30+',  label: 'Clients served' },
    { num: '9',    label: 'Services offered' },
    { num: '2022', label: 'Building since' },
];

const FALLBACK_SERVICES = [
    { id: 1, key: 'n8n-automation', title: 'N8N Workflow Automation', shortDescription: 'Connect the tools you already pay for and stop doing repetitive work by hand.' },
    { id: 2, key: 'ai-consulting',  title: 'AI Consulting',           shortDescription: 'A concrete plan for where AI saves your business money — and where it will not.' },
    { id: 3, key: 'ai-courses',     title: 'AI Courses & Training',   shortDescription: 'Practical AI training for teams, taught on your own workflows rather than toy examples.' },
];

const HomePage = () => {
    const { data } = useQuery({
        queryKey: ['services'],
        queryFn: () => contentService.getServices(),
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });

    // Prewarm the backend so the hero demo doesn't hit a Render cold start
    // (council reliability condition for the homepage tool demo).
    useEffect(() => {
        const base = `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api`;
        fetch(`${base}/health`).catch(() => {});
    }, []);

    const services = data?.data?.data || data?.data || [];
    const displayServices = services.length > 0 ? services.slice(0, 6) : FALLBACK_SERVICES;

    return (
        <main>
            {/* Hero: thesis + live tool demo (show, then assert) */}
            <section className="home-hero">
                <div className="v2-container">
                    <div className="v2-split v2-split--offset">
                        <div>
                            <Kicker>AI &amp; IT solutions · Kampala, Uganda</Kicker>
                            <h1 className="v2-h1">Software and AI that earn their keep.</h1>
                            <p className="v2-lead">
                                We build N8N automations, AI assistants, and custom software for
                                businesses across East Africa. Scoped in a week, delivered in weeks —
                                and you own everything we build.
                            </p>
                            <div className="v2-actions">
                                <Button to="/apply">Start a project</Button>
                                <Button
                                    variant="secondary"
                                    href="https://wa.me/256764524816?text=Hello%20Junior%20Reactive%20—%20I%27d%20like%20to%20talk%20about%20a%20project."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Message us on WhatsApp
                                </Button>
                            </div>
                        </div>
                        <div className="home-hero-demo">
                            <div className="home-hero-demo-frame">
                                <span className="home-hero-demo-label">
                                    Live — one of our AI tools
                                </span>
                                <ServiceRecommender />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Evidence strip */}
            <section className="home-evidence">
                <div className="v2-container">
                    <div className="home-evidence-grid">
                        {EVIDENCE.map((e) => (
                            <div key={e.label}>
                                <div className="home-evidence-num">{e.num}</div>
                                <div className="home-evidence-label">{e.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services: numbered editorial rows, not cards */}
            <section className="v2-section">
                <div className="v2-container">
                    <div className="v2-split v2-split--offset" style={{ alignItems: 'start' }}>
                        <div>
                            <Kicker>What we do</Kicker>
                            <h2 className="v2-h2">Work we take on</h2>
                            <p className="v2-body">
                                Every engagement starts with a problem worth solving, not a
                                technology looking for one. Fixed-scope quotes after a short
                                discovery call.
                            </p>
                        </div>
                        <div>
                            <div className="v2-rows">
                                {displayServices.map((s, i) => (
                                    <Link className="v2-row" to={`/services/${s.key}`} key={s.id}>
                                        <span className="v2-row-num">{String(i + 1).padStart(2, '0')}</span>
                                        <span>
                                            <h3 className="v2-row-title">{s.title}</h3>
                                            <p className="v2-row-desc">{s.shortDescription}</p>
                                        </span>
                                        <span className="v2-row-arrow"><Icon name="arrow-right" size="sm" ariaLabel="" /></span>
                                    </Link>
                                ))}
                            </div>
                            <div style={{ marginTop: 'var(--sp-6)' }}>
                                <Button variant="ghost" to="/services">All services <Icon name="arrow-right" size="xs" ariaLabel="" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navy statement band */}
            <section className="v2-band">
                <div className="v2-container">
                    <Kicker onDark>How we work</Kicker>
                    <p className="v2-statement">
                        Strategy, build, and support from one team in Kampala —
                        accountable to outcomes, not hours billed.
                    </p>
                    <Button variant="on-dark" to="/about">How an engagement runs</Button>
                </div>
            </section>

            {/* Founder: warm authority */}
            <section className="v2-section">
                <div className="v2-container">
                    <div className="v2-split">
                        <div>
                            <img
                                src="/images/team/Pharrell.jpeg"
                                alt="Pharrell Aaron Mugumya, founder of Junior Reactive, in Kampala"
                                className="home-founder-photo"
                                loading="lazy"
                            />
                            <p className="home-founder-name">Pharrell Aaron Mugumya</p>
                            <p className="home-founder-role">Founder, Junior Reactive</p>
                        </div>
                        <div>
                            <Kicker>Who you work with</Kicker>
                            <h2 className="v2-h2">A small team you can actually reach</h2>
                            <p className="v2-body">
                                Junior Reactive was founded in Kampala by Pharrell Aaron Mugumya.
                                When you hire us, the person who scopes your project is the person
                                who answers your messages — on WhatsApp, on a call, or in person.
                            </p>
                            <p className="v2-body" style={{ marginTop: 'var(--sp-4)' }}>
                                We work with SMEs and organisations across East Africa, and every
                                handover includes source code, documentation, and deployment access.
                                Your systems stay yours.
                            </p>
                            <div className="v2-actions">
                                <Button variant="secondary" to="/about">About the company</Button>
                                <Button variant="ghost" to="/portfolio">See past work</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="v2-section v2-section--wash">
                <div className="v2-container">
                    <Kicker>Next step</Kicker>
                    <h2 className="v2-h2">Tell us what you're trying to build</h2>
                    <p className="v2-lead">
                        A short call is enough to tell you whether we can help, what it would
                        cost, and how long it would take.
                    </p>
                    <div className="v2-actions">
                        <Button to="/apply">Start a project</Button>
                        <Button variant="secondary" to="/contact">Contact us</Button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;

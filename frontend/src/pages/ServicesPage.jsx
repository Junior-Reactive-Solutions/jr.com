import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonGrid } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import Icon from '../assets/icons/components/Icon';
import { useReveal } from '../hooks/useAnime';

const ServiceCard = ({ service }) => (
    <div className="card">
        <div className="card-icon"><Icon name={service.icon} size="lg" color="primary" ariaLabel={`${service.title} icon`} /></div>
        <h3 style={{ marginBottom: 10, fontSize: '1.1rem' }}>{service.title}</h3>
        <p style={{ fontSize: '.875rem', flex: 1 }}>{service.shortDescription}</p>
        <Link
            to={`/services/${service.key}`}
            style={{ display:'inline-flex',alignItems:'center',gap:6,color:'var(--color-secondary)',fontWeight:700,fontSize:'.875rem',marginTop:12 }}
        >
            Learn More <Icon name="arrow-right" size="xs" />
        </Link>
    </div>
);

const ServicesPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['services'],
        queryFn: () => contentService.getServices(),
        retry: 2,
    });

    const services = data?.data?.data || data?.data || [];
    const servicesRef = useReveal({ stagger: 80, y: 24 });

    return (
        <main>
            <HeroSection
                badge="What We Offer"
                title="Our Services"
                subtitle="Comprehensive AI and IT solutions — tailored to your scale, industry, and ambition."
                primaryBtnText="Apply Now"
                primaryBtnLink="/apply"
            />

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <SkeletonGrid count={6} />
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load services"
                            message="Make sure the backend is running on port 5005 and the database is seeded."
                            onRetry={refetch}
                        />
                    ) : services.length === 0 ? (
                        <ErrorState icon="empty" title="No services found" message="Run the seed script to populate services." />
                    ) : (
                        <div className="services-grid" ref={servicesRef}>
                            {services.map(s => <ServiceCard key={s.id} service={s} />)}
                        </div>
                    )}
                </div>
            </section>

            <section className="section" style={{ background: 'var(--color-white)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="section-header" style={{ marginBottom: 32 }}>
                        <h2>Need a Custom Solution?</h2>
                        <p className="section-sub">Every business is unique. Let's discuss your specific needs and build something together.</p>
                    </div>
                    <Link to="/apply" className="btn">Start a Project</Link>
                </div>
            </section>
        </main>
    );
};

export default ServicesPage;

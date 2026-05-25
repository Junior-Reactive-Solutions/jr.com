import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonText } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import Icon from '../assets/icons/components/Icon';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['service', id],
        queryFn: () => contentService.getServiceById(id),
    });

    const service = data?.data?.data;

    if (isLoading) {
        return (
            <main>
                <section style={{ background: 'var(--gradient-primary)', padding: '100px 0', textAlign: 'center' }}>
                    <div className="container">
                        <div className="skeleton skeleton-line-xl" style={{ width: 300, margin: '0 auto 16px', background: 'rgba(255,255,255,.15)' }} />
                        <div className="skeleton skeleton-line" style={{ width: 500, maxWidth: '100%', margin: '0 auto', background: 'rgba(255,255,255,.1)' }} />
                    </div>
                </section>
                <section className="section">
                    <div className="container" style={{ maxWidth: 800 }}>
                        <div className="form-card">
                            <SkeletonText lines={5} />
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (isError || !service) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <ErrorState
                            title="Service Not Found"
                            message="This service doesn't exist or couldn't be loaded."
                            onRetry={refetch}
                        >
                            <Link to="/services" className="btn btn-outline" style={{ marginTop: 16 }}>
                                ← Back to Services
                            </Link>
                        </ErrorState>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <HeroSection
                badge="Service Detail"
                title={`${service.icon ? service.icon + ' ' : ''}${service.title}`}
                subtitle={service.shortDescription}
            />

            <section className="section">
                <div className="container" style={{ maxWidth: 860 }}>
                    <div className="form-card">
                        <h2 style={{ marginBottom: 16 }}>Service Overview</h2>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
                            {service.fullDescription || service.shortDescription}
                        </p>

                        <div className="divider" />

                        <h3 style={{ marginBottom: 16 }}>Key Benefits</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                            {[
                                { icon: '✅', text: 'Expert consultation & planning' },
                                { icon: '⚡', text: 'Scalable, future-proof solutions' },
                                { icon: 'ui-lock', text: 'Secure & compliant delivery', isIconComponent: true },
                                { icon: '📞', text: 'Ongoing support & maintenance' },
                            ].map((b) => (
                                <div key={b.text} style={{
                                    display: 'flex', gap: 12, alignItems: 'flex-start',
                                    background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
                                    padding: '12px 14px', border: '1px solid var(--color-border)',
                                }}>
                                    <span style={{ fontSize: '1.1rem', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                        {b.isIconComponent ? <Icon name={b.icon} size="sm" ariaLabel="Secure" /> : b.icon}
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-mid)', fontWeight: 500 }}>{b.text}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <Link to={`/apply?service=${encodeURIComponent(service.title)}`} className="btn">
                                Apply for This Service
                            </Link>
                            <Link to="/services" className="btn btn-outline">← All Services</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ServiceDetailPage;

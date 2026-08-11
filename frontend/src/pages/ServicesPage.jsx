import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import PageIntro from '../components/layout/PageIntro';
import ErrorState from '../components/common/ErrorState';
import { Button, Kicker, Skeleton } from '../components/ui';
import Icon from '../assets/icons/components/Icon';
import Seo from '../components/Seo';

const ServicesPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['services'],
        queryFn: () => contentService.getServices(),
        retry: 2,
    });

    const services = data?.data?.data || data?.data || [];

    return (
        <main>
            <Seo
                title="Services"
                description="Nine fixed-scope services: AI consulting, N8N automation, custom software, cloud, data analytics, and AI training for East African businesses."
                path="/services"
            />
            <PageIntro
                kicker="Services"
                title="Work we take on"
                lead="Nine services, one standard: a fixed scope, a fixed quote, and a deliverable you own outright. If we're not the right fit for a job, we say so on the first call."
                actions={<Button to="/apply">Start a project</Button>}
            />

            <section className="v2-section">
                <div className="v2-container">
                    {isLoading ? (
                        <div>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{ padding: 'var(--sp-6) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <Skeleton height={22} width="40%" style={{ marginBottom: 10 }} />
                                    <Skeleton height={14} width="70%" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load services"
                            message="The server didn't respond. Try again in a moment."
                            onRetry={refetch}
                        />
                    ) : services.length === 0 ? (
                        <ErrorState icon="empty" title="No services found" message="Service listings are being updated. Check back shortly." />
                    ) : (
                        <div className="v2-rows">
                            {services.map((s, i) => (
                                <Link className="v2-row" to={`/services/${s.key}`} key={s.id}>
                                    <span className="v2-row-num">{String(i + 1).padStart(2, '0')}</span>
                                    <span>
                                        <h2 className="v2-row-title">{s.title}</h2>
                                        <p className="v2-row-desc">{s.shortDescription}</p>
                                    </span>
                                    <span className="v2-row-arrow"><Icon name="arrow-right" size="sm" ariaLabel="" /></span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="v2-band">
                <div className="v2-container">
                    <Kicker onDark>Not sure where to start?</Kicker>
                    <p className="v2-statement">
                        Describe the problem in a sentence. We'll tell you which of these
                        services solves it — or whether it needs solving at all.
                    </p>
                    <Button variant="on-dark" to="/contact">Ask us directly</Button>
                </div>
            </section>
        </main>
    );
};

export default ServicesPage;

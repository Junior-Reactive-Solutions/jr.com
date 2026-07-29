import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import PageIntro from '../components/layout/PageIntro';
import ErrorState from '../components/common/ErrorState';
import { Button, Kicker, Skeleton } from '../components/ui';
import Icon from '../assets/icons/components/Icon';

const ENGAGEMENT = [
    { step: '01', title: 'Discovery call', desc: 'Thirty minutes on the problem, your current tools, and whether this service fits.' },
    { step: '02', title: 'Fixed-scope quote', desc: 'A written scope, price, and timeline. You approve before any work starts.' },
    { step: '03', title: 'Build and check-ins', desc: 'Short delivery cycles with working output you can react to, not status reports.' },
    { step: '04', title: 'Handover', desc: 'Source code, documentation, deployment access, and a walkthrough session. It is yours.' },
];

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
                <section className="v2-intro">
                    <div className="v2-container">
                        <Skeleton height={16} width={120} style={{ marginBottom: 16 }} />
                        <Skeleton height={44} width="55%" style={{ marginBottom: 16 }} />
                        <Skeleton height={16} width="70%" />
                    </div>
                </section>
            </main>
        );
    }

    if (isError || !service) {
        return (
            <main>
                <section className="v2-section">
                    <div className="v2-container">
                        <ErrorState
                            title="Service not found"
                            message="This service doesn't exist or couldn't be loaded."
                            onRetry={refetch}
                        >
                            <Button variant="secondary" to="/services"><Icon name="arrow-left" size="xs" ariaLabel="" /> All services</Button>
                        </ErrorState>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <PageIntro
                kicker="Service"
                title={service.title}
                lead={service.shortDescription}
                actions={
                    <>
                        <Button to={`/apply?service=${encodeURIComponent(service.title)}`}>Start with this service</Button>
                        <Button variant="ghost" to="/services"><Icon name="arrow-left" size="xs" ariaLabel="" /> All services</Button>
                    </>
                }
            />

            <section className="v2-section">
                <div className="v2-container">
                    <div className="v2-split v2-split--offset" style={{ alignItems: 'start' }}>
                        <div>
                            <Kicker>What it is</Kicker>
                            <div className="v2-prose">
                                <p>{service.fullDescription || service.shortDescription}</p>
                            </div>
                        </div>
                        <div>
                            <Kicker>How the engagement runs</Kicker>
                            <div className="v2-rows">
                                {ENGAGEMENT.map((e) => (
                                    <div className="v2-row" key={e.step} style={{ cursor: 'default' }}>
                                        <span className="v2-row-num">{e.step}</span>
                                        <span>
                                            <h3 className="v2-row-title">{e.title}</h3>
                                            <p className="v2-row-desc">{e.desc}</p>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="v2-section v2-section--wash">
                <div className="v2-container">
                    <h2 className="v2-h2">Ready when you are</h2>
                    <p className="v2-lead">Apply with this service pre-selected, or ask a question first on WhatsApp.</p>
                    <div className="v2-actions">
                        <Button to={`/apply?service=${encodeURIComponent(service.title)}`}>Apply now</Button>
                        <Button
                            variant="secondary"
                            href="https://wa.me/256764524816"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp us
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ServiceDetailPage;

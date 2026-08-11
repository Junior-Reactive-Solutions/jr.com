import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import PageIntro from '../components/layout/PageIntro';
import ErrorState from '../components/common/ErrorState';
import { Accordion, Button, Skeleton } from '../components/ui';
import Seo from '../components/Seo';

const FAQPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['faqs'],
        queryFn: () => contentService.getFAQs(),
    });

    const faqs = data?.data?.data || [];

    return (
        <main>
            <Seo
                title="FAQ"
                description="Answers about pricing, timelines, ownership, and how Junior Reactive works with clients across East Africa."
                path="/faq"
                jsonLd={faqs.length > 0 ? {
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: faqs.map((f) => ({
                        '@type': 'Question',
                        name: f.question,
                        acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    })),
                } : undefined}
            />
            <PageIntro
                kicker="Questions"
                title="Asked before you asked"
                lead="Straight answers about pricing, timelines, ownership, and how we work. If yours isn't here, WhatsApp us — a person replies, not a bot."
            />

            <section className="v2-section">
                <div className="v2-container" style={{ maxWidth: 800 }}>
                    {isLoading ? (
                        <div>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} style={{ padding: 'var(--sp-5) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <Skeleton height={18} width="65%" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load FAQs"
                            message="The server did not respond. Try again in a moment."
                            onRetry={refetch}
                        />
                    ) : faqs.length === 0 ? (
                        <ErrorState icon="faq" title="No FAQs yet" message="Answers will appear here once published." />
                    ) : (
                        <Accordion
                            items={faqs.map((f) => ({ id: String(f.id), title: f.question, content: f.answer }))}
                        />
                    )}

                    {!isLoading && !isError && (
                        <div style={{ marginTop: 'var(--sp-12)' }}>
                            <h2 className="v2-h2">Something we didn't cover?</h2>
                            <div className="v2-actions">
                                <Button to="/contact">Contact us</Button>
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
                    )}
                </div>
            </section>
        </main>
    );
};

export default FAQPage;

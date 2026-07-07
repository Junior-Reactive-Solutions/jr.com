import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonFAQ } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';

const FAQItem = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <button className={`faq-question ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
                <span>{faq.question}</span>
                <div className={`faq-icon ${open ? 'open' : ''}`}>▾</div>
            </button>
            {open && (
                <div className="faq-answer">
                    <p style={{ margin: '12px 0 0' }}>{faq.answer}</p>
                </div>
            )}
        </div>
    );
};

const FAQPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['faqs'],
        queryFn: () => contentService.getFAQs(),
    });

    const faqs = data?.data?.data || [];

    return (
        <main>
            <HeroSection
                badge="Help Center"
                title="Frequently Asked Questions"
                subtitle="Find answers to the most common questions about our services and process."
            />

            <section className="section">
                <div className="container" style={{ maxWidth: 800 }}>
                    {isLoading ? (
                        <div>{Array.from({ length: 6 }).map((_, i) => <SkeletonFAQ key={i} />)}</div>
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load FAQs"
                            message="Make sure the backend is running on port 5005."
                            onRetry={refetch}
                        />
                    ) : faqs.length === 0 ? (
                        <ErrorState icon="faq" title="No FAQs yet" message="FAQs will appear here once added." />
                    ) : (
                        <div>
                            {faqs.map((faq) => <FAQItem key={faq.id} faq={faq} />)}
                        </div>
                    )}

                    {/* Still have questions CTA */}
                    {!isLoading && !isError && (
                        <div style={{
                            marginTop: 48, background: 'var(--gradient-light)',
                            borderRadius: 'var(--radius-lg)', padding: '32px 40px',
                            textAlign: 'center', border: '1px solid var(--color-border)',
                        }}>
                            <h3 style={{ marginBottom: 8 }}>Still have questions?</h3>
                            <p style={{ marginBottom: 24 }}>Our team is happy to help. Reach out directly.</p>
                            <Link to="/contact" className="btn">Contact Us</Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default FAQPage;

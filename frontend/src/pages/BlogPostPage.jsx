import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import ErrorState from '../components/common/ErrorState';
import { Button, Kicker, Skeleton } from '../components/ui';
import Icon from '../assets/icons/components/Icon';
import Seo from '../components/Seo';
import { SITE_URL } from '../config/seo';

const BlogPostPage = () => {
    const { slug } = useParams();
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['blog', slug],
        queryFn: () => contentService.getBlogPostBySlug(slug),
    });

    const post = data?.data?.data;

    if (isLoading) {
        return (
            <main>
                <section className="v2-intro">
                    <div className="v2-container" style={{ maxWidth: 780 }}>
                        <Skeleton height={14} width={140} style={{ marginBottom: 20 }} />
                        <Skeleton height={40} width="75%" style={{ marginBottom: 14 }} />
                        <Skeleton height={14} width="40%" />
                    </div>
                </section>
                <section className="v2-section">
                    <div className="v2-container" style={{ maxWidth: 780 }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} height={14} width={`${95 - (i % 3) * 10}%`} style={{ marginBottom: 12 }} />
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    if (isError || !post) {
        return (
            <main>
                <Seo title="Post not found" noindex />
                <section className="v2-section">
                    <div className="v2-container" style={{ maxWidth: 780 }}>
                        <ErrorState
                            title="Post not found"
                            message="This article doesn't exist or couldn't be loaded."
                            onRetry={refetch}
                        >
                            <Button variant="secondary" to="/blog"><Icon name="arrow-left" size="xs" ariaLabel="" /> All posts</Button>
                        </ErrorState>
                    </div>
                </section>
            </main>
        );
    }

    const paragraphs = (post.content || post.excerpt || '').split('\n').filter(Boolean);

    return (
        <main>
            <Seo
                title={post.title}
                description={post.excerpt || post.title}
                path={`/blog/${post.slug}`}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt,
                    author: { '@type': 'Person', name: post.author },
                    datePublished: post.publishedAt || post.createdAt,
                    publisher: { '@type': 'Organization', name: 'Junior Reactive', url: SITE_URL },
                    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
                }}
            />
            <section className="v2-intro">
                <div className="v2-container" style={{ maxWidth: 780 }}>
                    <Kicker>Writing</Kicker>
                    <h1 className="v2-h1" style={{ fontSize: 'var(--text-4xl)' }}>{post.title}</h1>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        {post.author} · {post.formattedDate}
                    </p>
                </div>
            </section>

            <section className="v2-section">
                <div className="v2-container" style={{ maxWidth: 780 }}>
                    <div className="v2-prose">
                        {post.excerpt && (
                            <p style={{
                                fontSize: 'var(--text-lg)',
                                color: 'var(--ink-800)',
                                fontWeight: 500,
                                borderLeft: '3px solid var(--accent-600)',
                                borderRadius: 0,
                                paddingLeft: 'var(--sp-5)',
                                marginBottom: 'var(--sp-8)',
                            }}>
                                {post.excerpt}
                            </p>
                        )}
                        {paragraphs.length > 0 ? (
                            paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Full article content is not available.</p>
                        )}
                    </div>

                    <div className="v2-actions" style={{ marginTop: 'var(--sp-12)', justifyContent: 'space-between' }}>
                        <Button variant="secondary" to="/blog"><Icon name="arrow-left" size="xs" ariaLabel="" /> All posts</Button>
                        <Button to="/contact">Talk to us about this</Button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BlogPostPage;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { SkeletonText } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import Icon from '../assets/icons/components/Icon';

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
                <section className="section">
                    <div className="container" style={{ maxWidth: 780 }}>
                        <div className="skeleton skeleton-line skeleton-w-1/4" style={{ marginBottom: 24 }} />
                        <div className="skeleton skeleton-line-xl skeleton-w-3/4" style={{ marginBottom: 12 }} />
                        <div className="skeleton skeleton-line skeleton-w-1/2" style={{ marginBottom: 40 }} />
                        <SkeletonText lines={8} />
                    </div>
                </section>
            </main>
        );
    }

    if (isError || !post) {
        return (
            <main>
                <section className="section">
                    <div className="container" style={{ maxWidth: 780 }}>
                        <ErrorState
                            title="Post Not Found"
                            message="This blog post doesn't exist or couldn't be loaded."
                            onRetry={refetch}
                        />
                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <Link to="/blog" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="arrow-left" size="xs" /> Back to Blog</Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    const paragraphs = (post.content || post.excerpt || '').split('\n').filter(Boolean);

    return (
        <main>
            {/* Post Header */}
            <section style={{
                background: 'var(--gradient-primary)',
                padding: '90px 0 70px',
                color: 'white',
                textAlign: 'center',
            }}>
                <div className="container" style={{ maxWidth: 780 }}>
                    <Link to="/blog" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        color: 'rgba(255,255,255,.7)', fontSize: '0.875rem',
                        fontWeight: 500, marginBottom: 24, transition: 'color .2s',
                    }}>
                        <Icon name="arrow-left" size="xs" color="white" /> Back to Blog
                    </Link>
                    <h1 style={{ color: 'white', marginBottom: 20 }}>{post.title}</h1>
                    <div style={{
                        display: 'flex', gap: 12, justifyContent: 'center',
                        alignItems: 'center', color: 'rgba(255,255,255,.7)',
                        fontSize: '0.875rem', flexWrap: 'wrap',
                    }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="author" size="xs" color="white" /> {post.author}</span>
                        <span>·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="calendar" size="xs" color="white" /> {post.formattedDate}</span>
                    </div>
                </div>
            </section>

            {/* Post Body */}
            <section className="section">
                <div className="container" style={{ maxWidth: 780 }}>
                    <div className="form-card">
                        {post.excerpt && (
                            <p style={{
                                fontSize: '1.15rem', color: 'var(--color-secondary)',
                                fontWeight: 500, borderLeft: '3px solid var(--color-secondary)',
                                paddingLeft: 20, marginBottom: 32, lineHeight: 1.7,
                            }}>
                                {post.excerpt}
                            </p>
                        )}
                        <div style={{ lineHeight: 1.85, fontSize: '1.05rem', color: 'var(--color-text-mid)' }}>
                            {paragraphs.length > 0 ? (
                                paragraphs.map((para, idx) => (
                                    <p key={idx} style={{ marginBottom: 20 }}>{para}</p>
                                ))
                            ) : (
                                <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                    Full article content is not available.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer nav */}
                    <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <Link to="/blog" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="arrow-left" size="xs" /> All Posts</Link>
                        <Link to="/contact" className="btn">Discuss This Topic</Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BlogPostPage;

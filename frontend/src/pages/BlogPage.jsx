import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import PageIntro from '../components/layout/PageIntro';
import ErrorState from '../components/common/ErrorState';
import { Skeleton } from '../components/ui';
import Icon from '../assets/icons/components/Icon';
import Seo from '../components/Seo';

const BlogPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['blog'],
        queryFn: () => contentService.getBlogPosts(),
    });

    const posts = data?.data?.data || [];

    return (
        <main>
            <Seo
                title="Blog"
                description="Notes on building AI and automation for East African businesses — written for business owners, not engineers."
                path="/blog"
            />
            <PageIntro
                kicker="Writing"
                title="Notes from the work"
                lead="What we're learning building AI and automation for East African businesses — written for business owners, not engineers."
            />

            <section className="v2-section">
                <div className="v2-container" style={{ maxWidth: 800 }}>
                    {isLoading ? (
                        <div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{ padding: 'var(--sp-6) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <Skeleton height={12} width={140} style={{ marginBottom: 10 }} />
                                    <Skeleton height={22} width="70%" style={{ marginBottom: 10 }} />
                                    <Skeleton height={14} width="90%" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load posts"
                            message="The server did not respond. Try again in a moment."
                            onRetry={refetch}
                        />
                    ) : posts.length === 0 ? (
                        <ErrorState icon="document" title="No posts yet" message="Articles will appear here once published." />
                    ) : (
                        <div className="v2-rows">
                            {posts.map((post) => (
                                <Link className="v2-row" to={`/blog/${post.slug}`} key={post.id} style={{ gridTemplateColumns: '1fr auto' }}>
                                    <span>
                                        <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
                                            {post.formattedDate} · {post.author}
                                        </span>
                                        <h2 className="v2-row-title">{post.title}</h2>
                                        <p className="v2-row-desc">{post.excerpt}</p>
                                    </span>
                                    <span className="v2-row-arrow"><Icon name="arrow-right" size="sm" ariaLabel="" /></span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BlogPage;

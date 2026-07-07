import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonBlogCard, SkeletonGrid } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import Icon from '../assets/icons/components/Icon';

const BlogPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['blog'],
        queryFn: () => contentService.getBlogPosts(),
    });

    const posts = data?.data?.data || [];

    return (
        <main>
            <HeroSection
                badge="Latest Insights"
                title="Blog & Insights"
                subtitle="News, trends, and thoughts on AI, technology, and business from the Junior Reactive team."
            />

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <SkeletonGrid count={6} Card={SkeletonBlogCard} />
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load posts"
                            message="Make sure the backend is running on port 5005."
                            onRetry={refetch}
                        />
                    ) : posts.length === 0 ? (
                        <ErrorState
                            icon="document"
                            title="No posts yet"
                            message="Blog posts will appear here once published."
                        />
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                            {posts.map((post) => (
                                <article key={post.id} className="blog-card">
                                    {/* Placeholder header image */}
                                    <div style={{
                                        height: 160,
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Icon name="blog" size="xl" color="white" ariaLabel="" />
                                    </div>
                                    <div className="blog-card-body">
                                        <div className="blog-meta">
                                            <span>{post.formattedDate}</span>
                                            <span>·</span>
                                            <span>{post.author}</span>
                                        </div>
                                        <h3>
                                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h3>
                                        <p>{post.excerpt}</p>
                                        <Link to={`/blog/${post.slug}`} className="read-more" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            Read More <Icon name="arrow-right" size="xs" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BlogPage;

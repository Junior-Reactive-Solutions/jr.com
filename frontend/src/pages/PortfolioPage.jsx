import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonPortfolioCard, SkeletonGrid } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';
import Icon from '../assets/icons/components/Icon';

// Deterministic gradient from title string
function titleGradient(title = '') {
    const hues = [220, 240, 260, 280, 200, 180];
    const idx = (title.charCodeAt(0) || 0) % hues.length;
    const h1 = hues[idx];
    const h2 = hues[(idx + 2) % hues.length];
    return `linear-gradient(135deg, hsl(${h1},55%,38%) 0%, hsl(${h2},65%,52%) 100%)`;
}

const PortfolioImage = ({ src, alt, gradient }) => {
    const [failed, setFailed] = React.useState(false);

    if (!src || failed) {
        return (
            <div style={{
                height: 200, background: gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,.7)',
            }}>
                <Icon name="image" size="xl" color="white" ariaLabel={alt || 'Project image'} />
            </div>
        );
    }

    return (
        <img
            src={`/images/portfolio/${src}`}
            alt={alt}
            style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
            onError={() => setFailed(true)}
        />
    );
};

const PortfolioPage = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['portfolio'],
        queryFn: () => contentService.getPortfolioProjects(),
    });

    const projects = data?.data?.data || [];

    return (
        <main>
            <HeroSection
                badge="Our Work"
                title="Portfolio"
                subtitle="A selection of projects that showcase our expertise across industries and technologies."
            />

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <SkeletonGrid count={6} Card={SkeletonPortfolioCard} />
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load portfolio"
                            message="Make sure the backend is running on port 5005."
                            onRetry={refetch}
                        />
                    ) : projects.length === 0 ? (
                        <ErrorState icon="files" title="No projects yet" message="Portfolio projects will appear here once added." />
                    ) : (
                        <div className="services-grid">
                            {projects.map((project) => (
                                <div key={project.id} className="portfolio-card">
                                    <PortfolioImage
                                        src={project.image}
                                        alt={project.title}
                                        gradient={titleGradient(project.title)}
                                    />
                                    <div className="portfolio-body">
                                        <span className="tag" style={{ marginBottom: 10, display: 'inline-block' }}>
                                            {project.category}
                                        </span>
                                        <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>{project.title}</h3>
                                        <p style={{ fontSize: '0.875rem' }}>{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default PortfolioPage;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import PageIntro from '../components/layout/PageIntro';
import ErrorState from '../components/common/ErrorState';
import { Badge, Button, Card, Skeleton } from '../components/ui';
import Icon from '../assets/icons/components/Icon';
import Seo from '../components/Seo';

const ProjectImage = ({ src, alt }) => {
    const [failed, setFailed] = React.useState(false);

    if (!src || failed) {
        // Flat wash placeholder — no generated gradients.
        return (
            <div
                aria-hidden="true"
                style={{
                    width: '100%', aspectRatio: '16 / 9', borderRadius: 'var(--r-md)',
                    background: 'var(--surface-wash)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-400)',
                }}
            >
                <Icon name="image" size="lg" ariaLabel="" />
            </div>
        );
    }

    return (
        <img
            src={`/images/portfolio/${src}`}
            alt={alt}
            style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 'var(--r-md)', display: 'block' }}
            onError={() => setFailed(true)}
            loading="lazy"
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
            <Seo
                title="Portfolio"
                description="Projects Junior Reactive has delivered for businesses across East Africa — AI systems, automation, and custom software."
                path="/portfolio"
            />
            <PageIntro
                kicker="Past work"
                title="Projects we've shipped"
                lead="Real deliverables for real clients. Where an engagement is under NDA, we describe the work without naming the name."
            />

            <section className="v2-section">
                <div className="v2-container">
                    {isLoading ? (
                        <div className="v2-grid-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <Skeleton height={140} style={{ marginBottom: 16 }} />
                                    <Skeleton height={18} width="70%" style={{ marginBottom: 8 }} />
                                    <Skeleton height={12} />
                                </Card>
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load portfolio"
                            message="The server did not respond. Try again in a moment."
                            onRetry={refetch}
                        />
                    ) : projects.length === 0 ? (
                        <ErrorState icon="files" title="No projects yet" message="Case studies will appear here once published." />
                    ) : (
                        <div className="v2-grid-3">
                            {projects.map((project) => (
                                <Card key={project.id} interactive>
                                    <ProjectImage src={project.image} alt={project.title} />
                                    <div style={{ marginTop: 'var(--sp-4)' }}>
                                        <Badge tone="accent">{project.category}</Badge>
                                    </div>
                                    <h2 className="v2-row-title" style={{ marginTop: 'var(--sp-3)' }}>{project.title}</h2>
                                    <p className="v2-body" style={{ fontSize: 'var(--text-sm)' }}>{project.description}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="v2-section v2-section--wash">
                <div className="v2-container">
                    <h2 className="v2-h2">Your project could be next</h2>
                    <p className="v2-lead">Tell us what you're working on and we'll tell you honestly whether we're the right team for it.</p>
                    <div className="v2-actions">
                        <Button to="/apply">Start a project</Button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PortfolioPage;

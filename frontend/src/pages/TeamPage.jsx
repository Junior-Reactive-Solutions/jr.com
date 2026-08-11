import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import PageIntro from '../components/layout/PageIntro';
import ErrorState from '../components/common/ErrorState';
import { Card, Skeleton } from '../components/ui';
import Seo from '../components/Seo';

function getInitials(name = '') {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

const MemberPhoto = ({ member }) => {
    const [imgFailed, setImgFailed] = React.useState(false);

    if (member.image && !imgFailed) {
        return (
            <img
                src={`/images/team/${member.image}`}
                alt={member.name}
                onError={() => setImgFailed(true)}
                style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 'var(--r-md)', display: 'block' }}
                loading="lazy"
            />
        );
    }

    // Flat initials tile — quiet wash, ink type, no gradients.
    return (
        <div
            aria-hidden="true"
            style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 'var(--r-md)',
                background: 'var(--surface-wash)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'var(--text-4xl)',
                color: 'var(--accent-700)',
                letterSpacing: 'var(--tracking-display)',
            }}>
                {getInitials(member.name)}
            </span>
        </div>
    );
};

const TeamPage = () => {
    const { data, isLoading, isError, refetch, error } = useQuery({
        queryKey: ['team'],
        queryFn: () => contentService.getTeamMembers(),
        retry: 2,
    });

    const members = data?.data?.data || data?.data || [];

    return (
        <main>
            <Seo
                title="Team"
                description="Meet the people building Junior Reactive's AI systems, automations, and custom software for East African businesses."
                path="/team"
            />
            <PageIntro
                kicker="Team"
                title="The people who build the work"
                lead="Small enough that you know who is on your project. Senior enough that you don't pay for anyone learning on your time."
            />

            <section className="v2-section">
                <div className="v2-container">
                    {isLoading ? (
                        <div className="v2-grid-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <Skeleton height={160} style={{ marginBottom: 16 }} />
                                    <Skeleton height={18} width="60%" style={{ marginBottom: 8 }} />
                                    <Skeleton height={12} width="40%" />
                                </Card>
                            ))}
                        </div>
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load team members"
                            message={error?.userMessage || 'The server did not respond. Try again in a moment.'}
                            onRetry={refetch}
                        />
                    ) : members.length === 0 ? (
                        <ErrorState icon="team" title="No team members yet" message="Team profiles will appear here once added." />
                    ) : (
                        <div className="v2-grid-3">
                            {members.map((member) => (
                                <Card key={member.id}>
                                    <MemberPhoto member={member} />
                                    <h2 className="v2-row-title" style={{ marginTop: 'var(--sp-4)' }}>{member.name}</h2>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-700)', fontWeight: 600, margin: '2px 0 var(--sp-3)' }}>
                                        {member.position}
                                    </p>
                                    <p className="v2-body" style={{ fontSize: 'var(--text-sm)' }}>{member.bio}</p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default TeamPage;

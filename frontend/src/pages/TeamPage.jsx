import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import { SkeletonGrid, SkeletonTeamCard } from '../components/common/SkeletonLoader';
import ErrorState from '../components/common/ErrorState';

// Generate a deterministic gradient and initials avatar for each team member
const AVATAR_GRADIENTS = [
    ['#1c265e','#5269c3'],
    ['#5269c3','#90a0da'],
    ['#2d3d8a','#a8ccee'],
    ['#1c265e','#7b91d4'],
    ['#3b4f9e','#90a0da'],
    ['#1c265e','#5269c3'],
];

function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

const MemberAvatar = ({ member, index }) => {
    const [imgFailed, setImgFailed] = React.useState(false);
    const [g1, g2] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
    const initials = getInitials(member.name);

    if (member.image && !imgFailed) {
        return (
            <div className="team-img-wrap">
                <img
                    src={`/images/team/${member.image}`}
                    alt={member.name}
                    onError={() => setImgFailed(true)}
                />
            </div>
        );
    }

    // Beautiful gradient avatar with initials
    return (
        <div className="team-img-wrap" style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 8,
            }}>
                <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '2.8rem',
                    color: 'rgba(255,255,255,.9)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                }}>
                    {initials}
                </span>
                <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,.6)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                }}>
                    {member.position.split(' ')[0]}
                </span>
            </div>
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
            <HeroSection
                badge="The People"
                title="Our Team"
                subtitle="The minds and talent behind every solution we deliver."
            />

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <SkeletonGrid count={6} Card={SkeletonTeamCard} />
                    ) : isError ? (
                        <ErrorState
                            title="Couldn't load team members"
                            message={error?.userMessage || 'Make sure the backend is running on port 5005.'}
                            onRetry={refetch}
                        />
                    ) : members.length === 0 ? (
                        <ErrorState icon="team" title="No team members yet" message="Team profiles will appear here once added to the database." />
                    ) : (
                        <div className="services-grid">
                            {members.map((member, i) => (
                                <div key={member.id} className="team-card">
                                    <MemberAvatar member={member} index={i} />
                                    <div className="team-card-body">
                                        <h3 style={{ marginBottom: 4 }}>{member.name}</h3>
                                        <p className="position">{member.position}</p>
                                        <p style={{ fontSize: '0.875rem' }}>{member.bio}</p>
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

export default TeamPage;

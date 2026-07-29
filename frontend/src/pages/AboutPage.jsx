import React from 'react';
import PageIntro from '../components/layout/PageIntro';
import { Button, Kicker } from '../components/ui';

const VALUES = [
    { title: 'Plain answers', desc: 'Quotes in writing, timelines you can hold us to, and a straight "no" when a technology will not pay for itself.' },
    { title: 'You own the work', desc: 'Source code, documentation, and deployment access are handed over at the end of every engagement.' },
    { title: 'Built for here', desc: 'Solutions designed around East African realities — data costs, mobile-first users, and the tools businesses here already run.' },
    { title: 'Small by intent', desc: 'The person who scopes your project is the person who builds and answers for it. No account managers in between.' },
];

const AboutPage = () => (
    <main>
        <PageIntro
            kicker="About"
            title="A Kampala software company that ships"
            lead="Junior Reactive builds automations, AI systems, and custom software for businesses across East Africa — founded and run by Pharrell Aaron Mugumya."
            actions={<Button variant="secondary" to="/team">Meet the team</Button>}
        />

        <section className="v2-section">
            <div className="v2-container">
                <div className="v2-split">
                    <div>
                        <Kicker>The story</Kicker>
                        <h2 className="v2-h2">Started with one conviction</h2>
                        <div className="v2-prose">
                            <p>
                                Junior Reactive began with a simple observation: businesses across
                                East Africa were being sold technology they didn't need, while the
                                automation that would actually save them money went unbuilt.
                            </p>
                            <p>
                                We build the second kind. N8N workflows that remove hours of manual
                                work each week. AI assistants trained on a business's own knowledge.
                                Custom software where off-the-shelf tools genuinely fall short — and
                                honest advice when they don't.
                            </p>
                            <p>
                                From solo entrepreneurs to established organisations, clients come
                                to us with problems, not specifications. That's how we like it.
                            </p>
                        </div>
                    </div>
                    <div>
                        <img
                            src="/images/team/Pharrell.jpeg"
                            alt="Pharrell Aaron Mugumya, founder of Junior Reactive"
                            className="home-founder-photo"
                            loading="lazy"
                        />
                        <p className="home-founder-name">Pharrell Aaron Mugumya</p>
                        <p className="home-founder-role">Founder &amp; CEO — Kampala, Uganda</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="v2-section v2-section--wash">
            <div className="v2-container">
                <Kicker>How we work</Kicker>
                <h2 className="v2-h2">What you can hold us to</h2>
                <div className="v2-grid-2" style={{ marginTop: 'var(--sp-8)' }}>
                    {VALUES.map((v) => (
                        <div key={v.title}>
                            <h3 className="v2-row-title">{v.title}</h3>
                            <p className="v2-body">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="v2-band">
            <div className="v2-container">
                <Kicker onDark>Working together</Kicker>
                <p className="v2-statement">
                    Bring us the problem. We'll bring a scope, a price, and a date.
                </p>
                <Button variant="on-dark" to="/apply">Start a project</Button>
            </div>
        </section>
    </main>
);

export default AboutPage;

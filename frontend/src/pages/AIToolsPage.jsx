import React from 'react';
import ServiceRecommender from '../components/ServiceRecommender';
import ProjectBriefGenerator from '../components/ProjectBriefGenerator';
import PageIntro from '../components/layout/PageIntro';
import { Button, Kicker, Tabs } from '../components/ui';

const BUILD_LIST = [
    { title: 'Custom chatbots', desc: 'Trained on your data, integrated with your CRM, answering on your website day and night.' },
    { title: 'Smart recommenders', desc: 'Product recommenders, service matchers, and lead qualifiers — plain logic or AI, whichever the job needs.' },
    { title: 'Document generators', desc: 'Proposals, briefs, contracts, and reports generated from a form in seconds.' },
    { title: 'AI analytics dashboards', desc: 'Dashboards that explain the numbers in plain English instead of just charting them.' },
    { title: 'AI-powered workflows', desc: 'N8N plus AI: automated decisions, classification, and summarisation inside your daily operations.' },
    { title: 'Smart search and Q&A', desc: 'Let customers ask questions about your products, documents, or knowledge base.' },
];

export default function AIToolsPage() {
    return (
        <main>
            <PageIntro
                kicker="Live tools"
                title="Don't take our word for it — use the tools"
                lead="Both tools below are production systems we built and run ourselves. The same engineering goes into what we build for clients."
            />

            <section className="v2-section">
                <div className="v2-container">
                    <Tabs
                        items={[
                            {
                                id: 'recommender',
                                label: 'Service recommender',
                                content: (
                                    <div className="v2-split v2-split--offset" style={{ alignItems: 'start' }}>
                                        <div>
                                            <Kicker>What this is</Kicker>
                                            <h2 className="v2-h2">Five questions, one honest match</h2>
                                            <p className="v2-body">
                                                Answer five questions about your situation and budget, and it
                                                names the service that fits — with a direct link to apply.
                                                Runs entirely in your browser: no signup, no data sent anywhere
                                                until you choose to act on the result.
                                            </p>
                                        </div>
                                        <div className="home-hero-demo-frame"><ServiceRecommender /></div>
                                    </div>
                                ),
                            },
                            {
                                id: 'brief',
                                label: 'Project brief generator',
                                content: (
                                    <div className="v2-split v2-split--offset" style={{ alignItems: 'start' }}>
                                        <div>
                                            <Kicker>What this is</Kicker>
                                            <h2 className="v2-h2">A written brief from a description</h2>
                                            <p className="v2-body">
                                                Describe your business challenge in a few sentences and get a
                                                structured project brief — scope, timeline, budget estimate,
                                                recommended approach — in about fifteen seconds. Built on
                                                Llama 3.3 via Groq, the same stack we deploy for clients.
                                            </p>
                                        </div>
                                        <div className="home-hero-demo-frame"><ProjectBriefGenerator /></div>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </section>

            <section className="v2-section v2-section--wash">
                <div className="v2-container">
                    <div className="v2-split v2-split--offset" style={{ alignItems: 'start' }}>
                        <div>
                            <Kicker>For your business</Kicker>
                            <h2 className="v2-h2">The same tools, built for you</h2>
                            <p className="v2-body">
                                Everything on this page is a working template for something we can
                                put inside your product or workflow.
                            </p>
                            <div className="v2-actions">
                                <Button to="/apply">Start a project</Button>
                                <Button variant="secondary" to="/contact">Ask a question</Button>
                            </div>
                        </div>
                        <div className="v2-rows">
                            {BUILD_LIST.map((item, i) => (
                                <div className="v2-row" key={item.title} style={{ cursor: 'default' }}>
                                    <span className="v2-row-num">{String(i + 1).padStart(2, '0')}</span>
                                    <span>
                                        <h3 className="v2-row-title">{item.title}</h3>
                                        <p className="v2-row-desc">{item.desc}</p>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

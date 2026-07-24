import React from 'react';
import PageIntro from '../components/layout/PageIntro';
import ApplicationForm from '../components/forms/ApplicationForm';

const ApplyPage = () => (
    <main>
        <PageIntro
            kicker="Start a project"
            title="Tell us what you need built"
            lead="Five minutes of detail is enough. We read every application ourselves and reply within one working day with next steps — or honest reasons why we're not the right fit."
        />

        <section className="v2-section">
            <div className="v2-container" style={{ maxWidth: 860 }}>
                <ApplicationForm />
            </div>
        </section>
    </main>
);

export default ApplyPage;

import React from 'react';
import PageIntro from '../components/layout/PageIntro';
import { Button } from '../components/ui';
import Seo from '../components/Seo';

const NotFoundPage = () => (
    <main>
        <Seo title="Page not found" noindex />
        <PageIntro
            kicker="404"
            title="That page isn't here"
            lead="The address may have changed, or the link you followed is out of date. Everything we offer is one click away."
            actions={
                <>
                    <Button to="/">Back to the homepage</Button>
                    <Button variant="secondary" to="/services">Browse services</Button>
                </>
            }
        />
    </main>
);

export default NotFoundPage;

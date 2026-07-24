import React from 'react';
import PageIntro from '../components/layout/PageIntro';
import { Button } from '../components/ui';

const NotFoundPage = () => (
    <main>
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

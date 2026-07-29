import React from 'react';
import { Kicker } from '../ui';

/**
 * v2 page opener: kicker + display title + lead + optional actions.
 * Replaces the legacy HeroSection on inner pages.
 */
const PageIntro = ({ kicker, title, lead, actions, children }) => (
    <section className="v2-intro">
        <div className="v2-container">
            {kicker && <Kicker>{kicker}</Kicker>}
            <h1 className="v2-h1">{title}</h1>
            {lead && <p className="v2-lead">{lead}</p>}
            {actions && <div className="v2-actions">{actions}</div>}
            {children}
        </div>
    </section>
);

export default PageIntro;

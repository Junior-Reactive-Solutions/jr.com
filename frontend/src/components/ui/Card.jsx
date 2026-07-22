import React from 'react';

/** v2 Card. interactive adds hover affordance; sunken for quiet fills. */
const Card = ({ interactive = false, sunken = false, children, className = '', ...props }) => {
    const cls = [
        'ui-card',
        interactive ? 'ui-card--interactive' : '',
        sunken ? 'ui-card--sunken' : '',
        className,
    ].filter(Boolean).join(' ');
    return <div className={cls} {...props}>{children}</div>;
};

export default Card;

import React from 'react';

/** Section kicker label — small caps, letter-spaced. */
const Kicker = ({ onDark = false, children, className = '', ...props }) => (
    <span
        className={`ui-kicker ${onDark ? 'ui-kicker--on-dark' : ''} ${className}`.trim()}
        {...props}
    >
        {children}
    </span>
);

export default Kicker;

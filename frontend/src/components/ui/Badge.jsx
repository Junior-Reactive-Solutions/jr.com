import React from 'react';

/** v2 Badge. tone: neutral | accent | navy | success | error | warning */
const Badge = ({ tone = 'neutral', children, className = '', ...props }) => (
    <span className={`ui-badge ui-badge--${tone} ${className}`.trim()} {...props}>
        {children}
    </span>
);

export default Badge;

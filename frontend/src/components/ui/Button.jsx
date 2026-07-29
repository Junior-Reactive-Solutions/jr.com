import React from 'react';
import { Link } from 'react-router-dom';

/**
 * v2 Button. variant: primary | secondary | ghost | on-dark
 * size: sm | md | lg. Renders <Link> if `to`, <a> if `href`.
 */
const Button = ({ variant = 'primary', size = 'md', to, href, children, className = '', ...props }) => {
    const cls = [
        'ui-btn',
        `ui-btn--${variant}`,
        size !== 'md' ? `ui-btn--${size}` : '',
        className,
    ].filter(Boolean).join(' ');

    if (to) return <Link to={to} className={cls} {...props}>{children}</Link>;
    if (href) return <a href={href} className={cls} {...props}>{children}</a>;
    return <button type="button" className={cls} {...props}>{children}</button>;
};

export default Button;

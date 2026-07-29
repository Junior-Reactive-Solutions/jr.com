import React from 'react';
import Icon from '../../assets/icons/components/Icon';

/** v2 EmptyState: icon + title + hint + optional action. */
const EmptyState = ({ icon = 'empty', title, hint, action, className = '' }) => (
    <div className={`ui-empty ${className}`.trim()}>
        <span className="ui-empty__icon"><Icon name={icon} size="xl" ariaLabel="" /></span>
        {title && <span className="ui-empty__title">{title}</span>}
        {hint && <span className="ui-empty__hint">{hint}</span>}
        {action}
    </div>
);

export default EmptyState;

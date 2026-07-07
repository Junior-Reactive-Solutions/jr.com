import React from 'react';
import Icon from '../../assets/icons/components/Icon';

const ErrorState = ({
    icon,
    title = 'Something went wrong',
    message,
    onRetry,
    retryLabel = 'Try Again',
}) => (
    <div className="error-state">
        <div className="error-icon">
            <Icon name={icon || 'ui-lock'} size="xl" color="error" ariaLabel="Error" />
        </div>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        {onRetry && (
            <button className="btn" onClick={onRetry} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icon name="refresh" size="xs" color="white" /> {retryLabel}
            </button>
        )}
    </div>
);

export default ErrorState;

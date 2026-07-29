import React from 'react';
import Icon from '../../assets/icons/components/Icon';

/**
 * Consistent error state for admin data views. Every admin page's data
 * fetch was previously silently swallowing failures and rendering a fake
 * "empty" state instead — this makes the failure visible with a retry.
 */
const AdminErrorState = ({ message, onRetry }) => (
    <div className="admin-empty-state admin-error-state">
        <div className="admin-empty-icon"><Icon name="warning" size="xl" color="error" ariaLabel="Error" /></div>
        <p>{message || 'Something went wrong loading this data.'}</p>
        {onRetry && (
            <button className="admin-btn admin-btn-primary" onClick={onRetry} style={{ marginTop: 12 }}>
                Try again
            </button>
        )}
    </div>
);

export default AdminErrorState;

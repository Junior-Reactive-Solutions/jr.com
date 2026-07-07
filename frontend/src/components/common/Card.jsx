import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../assets/icons/components/Icon';

const Card = ({ icon, title, description, linkTo, linkText = 'Learn More' }) => (
    <div className="card">
        {icon && <div className="card-icon"><Icon name={icon} size="lg" color="primary" ariaLabel={`${title || ''} icon`} /></div>}
        <h3 style={{ marginBottom: 10, fontSize: '1.15rem' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', flex: 1 }}>{description}</p>
        {linkTo && (
            <Link
                to={linkTo}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--color-secondary)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    marginTop: 12,
                    transition: 'gap 0.2s',
                }}
            >
                {linkText} <Icon name="arrow-right" size="xs" />
            </Link>
        )}
    </div>
);

export default Card;

import React from 'react';
import Icon from '../../assets/icons/components/Icon';

// Persistent WhatsApp entry point — this market converts through WhatsApp,
// not contact forms (competitive audit, council amendment 3).
const WhatsAppCta = () => (
    <a
        className="wa-cta"
        href="https://wa.me/256764524816?text=Hello%20Junior%20Reactive%20—%20I%27d%20like%20to%20talk%20about%20a%20project."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Junior Reactive on WhatsApp"
    >
        <Icon name="message" size="xs" ariaLabel="" />
        WhatsApp us
    </a>
);

export default WhatsAppCta;

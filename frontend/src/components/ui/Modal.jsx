import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * v2 Modal. Controlled: open / onClose. ESC and overlay click close it.
 */
const Modal = ({ open, onClose, title, actions, children }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKey);
        panelRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="ui-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div className="ui-modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={panelRef}>
                {title && <h3 className="ui-modal__title">{title}</h3>}
                <div className="ui-modal__body">{children}</div>
                {actions && <div className="ui-modal__actions">{actions}</div>}
            </div>
        </div>,
        document.body
    );
};

export default Modal;

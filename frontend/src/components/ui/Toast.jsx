import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import Icon from '../../assets/icons/components/Icon';

const ToastContext = createContext(null);

/** useToast().show(message, { tone: 'info' | 'success' | 'error', duration }) */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

const TONE_ICON = { success: 'success', error: 'error', info: 'faq' };

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const show = useCallback((message, { tone = 'info', duration = 4000 } = {}) => {
        const id = ++idRef.current;
        setToasts((t) => [...t, { id, message, tone }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
    }, []);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div className="ui-toast-stack" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} className={`ui-toast ui-toast--${t.tone}`} role="status">
                        <Icon name={TONE_ICON[t.tone] || 'faq'} size="sm" ariaLabel="" />
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

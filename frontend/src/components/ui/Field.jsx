import React, { useId } from 'react';
import Icon from '../../assets/icons/components/Icon';

/**
 * v2 form field wrapper: label + control + hint/error.
 * Pass `as`: 'input' (default) | 'textarea' | 'select'.
 */
const Field = ({ label, hint, error, as = 'input', children, className = '', ...controlProps }) => {
    const id = useId();
    const controlCls = { input: 'ui-input', textarea: 'ui-textarea', select: 'ui-select' }[as];
    const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;

    const control = as === 'select'
        ? <select id={id} className={controlCls} aria-invalid={!!error} aria-describedby={describedBy} {...controlProps}>{children}</select>
        : as === 'textarea'
            ? <textarea id={id} className={controlCls} aria-invalid={!!error} aria-describedby={describedBy} {...controlProps} />
            : <input id={id} className={controlCls} aria-invalid={!!error} aria-describedby={describedBy} {...controlProps} />;

    return (
        <div className={`ui-field ${error ? 'ui-field--invalid' : ''} ${className}`.trim()}>
            {label && <label className="ui-field__label" htmlFor={id}>{label}</label>}
            {control}
            {error
                ? <span className="ui-field__error" id={`${id}-err`}><Icon name="warning" size="sm" ariaLabel="" />{error}</span>
                : hint && <span className="ui-field__hint" id={`${id}-hint`}>{hint}</span>}
        </div>
    );
};

export default Field;

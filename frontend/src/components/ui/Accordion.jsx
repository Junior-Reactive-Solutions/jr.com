import React, { useState } from 'react';
import Icon from '../../assets/icons/components/Icon';

/**
 * v2 Accordion. items: [{ id, title, content }]. One open at a time.
 */
const Accordion = ({ items = [], className = '' }) => {
    const [openId, setOpenId] = useState(null);

    return (
        <div className={`ui-accordion ${className}`.trim()}>
            {items.map((item) => {
                const open = openId === item.id;
                return (
                    <div key={item.id} className={`ui-accordion__item ${open ? 'ui-accordion__item--open' : ''}`}>
                        <button
                            type="button"
                            className="ui-accordion__trigger"
                            aria-expanded={open}
                            onClick={() => setOpenId(open ? null : item.id)}
                        >
                            {item.title}
                            <span className="ui-accordion__chevron">
                                <Icon name="chevron-down" size="sm" ariaLabel="" />
                            </span>
                        </button>
                        {open && <div className="ui-accordion__body">{item.content}</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;

import React, { useState } from 'react';

/**
 * v2 Tabs. items: [{ id, label, content }]. Uncontrolled with optional defaultId.
 */
const Tabs = ({ items = [], defaultId, className = '' }) => {
    const [active, setActive] = useState(defaultId || items[0]?.id);
    const current = items.find((i) => i.id === active) || items[0];

    return (
        <div className={className}>
            <div className="ui-tabs__list" role="tablist">
                {items.map((item) => (
                    <button
                        key={item.id}
                        role="tab"
                        type="button"
                        aria-selected={item.id === active}
                        className={`ui-tabs__tab ${item.id === active ? 'ui-tabs__tab--active' : ''}`}
                        onClick={() => setActive(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="ui-tabs__panel" role="tabpanel">
                {current?.content}
            </div>
        </div>
    );
};

export default Tabs;

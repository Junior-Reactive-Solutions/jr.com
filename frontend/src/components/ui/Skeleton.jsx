import React from 'react';

/** v2 Skeleton block. Pass width/height (CSS values). */
const Skeleton = ({ width = '100%', height = 16, className = '', style, ...props }) => (
    <div
        className={`ui-skeleton ${className}`.trim()}
        style={{ width, height, ...style }}
        aria-hidden="true"
        {...props}
    />
);

export default Skeleton;

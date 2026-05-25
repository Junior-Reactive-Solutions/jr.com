import React from 'react';
import '../styles.css';

/**
 * Icon Component - Renders scalable SVG icons with theming support
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Icon name (required). Valid values: 'service-ai', 'service-dev', 'service-automation', 'service-analytics', 'action-search', 'action-email', 'action-document', 'action-rocket', 'ui-target', 'ui-settings', 'ui-messages', 'ui-lock', 'state-user', 'state-team', 'state-empty'
 * @param {string} [props.size='md'] - Icon size. Valid values: 'sm' (24px), 'md' (32px), 'lg' (48px), 'xl' (64px)
 * @param {string} [props.color='primary'] - Icon color. Valid values: 'primary', 'secondary', 'accent', 'success', 'error', 'white'
 * @param {string} [props.variant='outlined'] - Icon style. Valid values: 'outlined', 'filled', 'mixed'
 * @param {string} [props.ariaLabel=''] - Accessibility label (recommended for semantic icons). Required for icons with role='img'
 * @param {string} [props.tooltip=''] - Hover tooltip text
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Icon element or null if name prop is missing
 *
 * @example
 * // Semantic icon with accessibility
 * <Icon name="service-ai" size="lg" ariaLabel="AI Consulting Services" tooltip="Learn about our AI solutions" />
 *
 * // Decorative icon
 * <Icon name="action-rocket" size="md" color="success" />
 */
const Icon = ({
  name,                    // Required: icon name (e.g., 'ai', 'email')
  size = 'md',             // Optional: sm, md, lg, xl (default: md)
  color = 'primary',       // Optional: primary, secondary, accent, success, error, white
  variant = 'outlined',    // Optional: outlined, filled, mixed (default: outlined)
  className = '',          // Optional: additional CSS classes
  ariaLabel = '',          // Optional: screen reader label
  tooltip = '',            // Optional: hover tooltip text
  ...props                 // Pass through other props
}) => {
  // Validate required props
  if (!name) {
    console.warn('Icon component requires a "name" prop');
    return null;
  }

  // Map sizes to pixel values
  const sizeMap = {
    sm: '24px',
    md: '32px',
    lg: '48px',
    xl: '64px',
  };

  const sizeValue = sizeMap[size] || sizeMap.md;

  // Build CSS classes
  const cssClasses = [
    'icon',
    `icon-${name}`,
    `icon-${size}`,
    `icon-${color}`,
    `icon-${variant}`,
    className
  ].filter(Boolean).join(' ');

  // Icon SVG import path
  const iconPath = `/icons/svg/${name}.svg`;

  return (
    <span
      className={cssClasses}
      style={{
        width: sizeValue,
        height: sizeValue,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      <img
        src={iconPath}
        alt=""
        aria-hidden="true"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </span>
  );
};

export default Icon;

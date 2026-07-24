import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { adminLogout } from '../../services/adminService';

// ── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const ICONS = {
    dashboard:    'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
    messages:     'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
    applications: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    services:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    faqs:         'M12 17h.01 M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4',
    analytics:    'M18 20V10 M12 20V4 M6 20v-6',
    logout:       'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
    menu:         'M3 12h18 M3 6h18 M3 18h18',
    close:        'M18 6L6 18 M6 6l12 12',
    logo:         'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
    external:     'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3',
};

const NAV_SECTIONS = [
    {
        label: 'Overview',
        items: [
            { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
            { to: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
        ],
    },
    {
        label: 'Inbox',
        items: [
            { to: '/admin/messages',     label: 'Messages',     icon: 'messages',     badge: 'unread' },
            { to: '/admin/applications', label: 'Applications', icon: 'applications', badge: 'new'    },
        ],
    },
    {
        label: 'Content',
        items: [
            { to: '/admin/services', label: 'Services', icon: 'services' },
            { to: '/admin/faqs',     label: 'FAQs',      icon: 'faqs' },
        ],
    },
];

export default function AdminLayout({ children, unreadCount = 0, newAppsCount = 0 }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const badgeFor = (badge) => {
        if (badge === 'unread' && unreadCount > 0) return unreadCount;
        if (badge === 'new'    && newAppsCount > 0) return newAppsCount;
        return null;
    };

    const handleLogout = async () => {
        await adminLogout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-shell">
            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Sidebar ── */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Brand */}
                <div className="admin-sidebar-brand">
                    <div className="admin-brand-logo">
                        <span className="brand-j">J</span><span className="brand-r">R</span>
                    </div>
                    {!sidebarCollapsed && (
                        <div>
                            <div className="admin-brand-name">Junior Reactive</div>
                            <div className="admin-brand-sub">Admin Panel</div>
                        </div>
                    )}
                    <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
                        <Icon d={ICONS.close} size={18} />
                    </button>
                    <button
                        className="admin-sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <Icon d={sidebarCollapsed ? 'M9 5l7 7-7 7 M2 12h14' : 'M15 19l-7-7 7-7 M22 12H8'} size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="admin-nav">
                    {NAV_SECTIONS.map(section => (
                        <div key={section.label} className="admin-nav-section">
                            {!sidebarCollapsed && <div className="admin-nav-label">{section.label}</div>}
                            {section.items.map(item => {
                                const badge = badgeFor(item.badge);
                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setSidebarOpen(false)}
                                        title={sidebarCollapsed ? item.label : ''}
                                    >
                                        <span className="admin-nav-item-icon"><Icon d={ICONS[item.icon]} size={17} /></span>
                                        {!sidebarCollapsed && <span className="admin-nav-item-label">{item.label}</span>}
                                        {badge && <span className="admin-nav-badge">{badge}</span>}
                                    </NavLink>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className="admin-sidebar-footer">
                    <div className="admin-user-card">
                        <div className="admin-user-avatar">PA</div>
                        {!sidebarCollapsed && (
                            <div className="admin-user-info">
                                <div>Pharrell Aaron</div>
                                <div>Administrator</div>
                            </div>
                        )}
                    </div>
                    {!sidebarCollapsed && (
                        <button className="admin-logout-btn" onClick={handleLogout}>
                            <Icon d={ICONS.logout} size={16} />
                            Log out
                        </button>
                    )}
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="admin-main">
                {/* Top bar (mobile) */}
                <header className="admin-topbar">
                    <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
                        <Icon d={ICONS.menu} size={22} />
                    </button>
                    <div className="admin-topbar-brand">
                        <span className="brand-j">J</span><span className="brand-r">R</span>
                        &nbsp;Admin
                    </div>
                    <a href="https://jrcom.vercel.app" target="_blank" rel="noopener noreferrer"
                        className="admin-view-site-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        View site <Icon d={ICONS.external} size={14} />
                    </a>
                </header>

                {/* Page content */}
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

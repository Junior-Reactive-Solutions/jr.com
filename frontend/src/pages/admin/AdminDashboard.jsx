import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../assets/icons/components/Icon';
import { getDashboard } from '../../services/adminService';

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (ts) => ts
    ? new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

const statusCls = { new: 'badge-blue', reviewed: 'badge-yellow', accepted: 'badge-green', rejected: 'badge-red' };

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, total, today, sub, color, link }) {
    return (
        <Link to={link || '#'} className={`admin-stat-card admin-stat-${color}`}>
            <div className="admin-stat-icon">{icon}</div>
            <div className="admin-stat-body">
                <div className="admin-stat-total">{total}</div>
                <div className="admin-stat-label">{label}</div>
                {today !== undefined && (
                    <div className="admin-stat-today">+{today} today</div>
                )}
                {sub && <div className="admin-stat-today">{sub}</div>}
            </div>
        </Link>
    );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ data }) {
    if (!data?.length) return (
        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <Icon name="state-empty" size="lg" ariaLabel="No data" style={{ marginBottom: 16, opacity: 0.5 }} />
            <p className="admin-empty">No data yet</p>
        </div>
    );
    const max = Math.max(...data.map(d => d.total), 1);
    return (
        <div className="admin-bar-chart">
            {data.map((d, i) => (
                <div className="admin-bar-col" key={i}>
                    <div className="admin-bar-value">{d.total > 0 ? d.total : ''}</div>
                    <div
                        className="admin-bar"
                        style={{ height: `${Math.max((d.total / max) * 100, d.total > 0 ? 6 : 2)}%` }}
                    />
                    <div className="admin-bar-label">{d.label}</div>
                </div>
            ))}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');

    useEffect(() => {
        getDashboard()
            .then(res => { if (res.success) setData(res.data); else setError(res.error); })
            .catch(() => setError('Failed to load dashboard.'))
            .finally(() => setLoading(false));
    }, []);

    const unread   = data?.stats?.messages?.unread   || 0;
    const newApps  = data?.stats?.applications?.new  || 0;

    if (loading) return (
        <AdminLayout>
            <div className="admin-loading"><div className="admin-spinner" /><span>Loading dashboard…</span></div>
        </AdminLayout>
    );

    if (error) return (
        <AdminLayout>
            <div className="admin-alert admin-alert-error">{error}</div>
        </AdminLayout>
    );

    const { stats, chart, topPages, recentMessages, recentApps } = data;

    return (
        <AdminLayout unreadCount={unread} newAppsCount={newApps}>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard</h1>
                    <p className="admin-page-sub">Welcome back, Pharrell. Here's what's happening.</p>
                </div>
                <span className="admin-date-badge">
                    {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>

            {/* ── Stat Cards ── */}
            <div className="admin-stats-grid">
                <StatCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                    label="Total Messages" total={stats.messages.total} today={stats.messages.today}
                    sub={unread > 0 ? `${unread} unread` : 'All read'}
                    color="blue" link="/admin/messages"
                />
                <StatCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                    label="Applications" total={stats.applications.total} today={stats.applications.today}
                    sub={newApps > 0 ? `${newApps} pending review` : 'All reviewed'}
                    color="purple" link="/admin/applications"
                />
                <StatCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
                    label="Page Views Today" total={stats.pageViewsToday}
                    color="green" link="/admin/analytics"
                />
                <StatCard
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>}
                    label="Active Services" total={stats.services}
                    color="orange" link="/admin/services"
                />
            </div>

            {/* ── Chart + Top Pages ── */}
            <div className="admin-row-2">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Page Views — Last 7 Days</h3>
                    </div>
                    <BarChart data={chart} />
                </div>
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Top Pages (30 days)</h3>
                    </div>
                    {topPages?.length ? (
                        <div className="admin-top-pages">
                            {topPages.map((p, i) => (
                                <div className="admin-top-page-row" key={i}>
                                    <span className="admin-top-page-num">{i + 1}</span>
                                    <span className="admin-top-page-path">{p.page_path || '/'}</span>
                                    <span className="admin-top-page-count">{p.total}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                            <Icon name="state-empty" size="lg" ariaLabel="No data" style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p className="admin-empty">No page views yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="admin-row-2">
                {/* Recent Messages */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Recent Messages</h3>
                        <Link to="/admin/messages" className="admin-card-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>View all <Icon name="arrow-right" size="xs" /></Link>
                    </div>
                    {recentMessages?.length ? (
                        <div className="admin-mini-list">
                            {recentMessages.map(m => (
                                <div className={`admin-mini-item ${!m.is_read ? 'unread' : ''}`} key={m.id}>
                                    <div className="admin-mini-avatar">{m.name?.[0]?.toUpperCase()}</div>
                                    <div className="admin-mini-body">
                                        <div className="admin-mini-name">
                                            {m.name}
                                            {!m.is_read && <span className="admin-unread-dot" />}
                                        </div>
                                        <div className="admin-mini-sub">{m.subject}</div>
                                    </div>
                                    <div className="admin-mini-date">{fmt(m.submitted_at)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                            <Icon name="state-empty" size="lg" ariaLabel="No data" style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p className="admin-empty">No messages yet</p>
                        </div>
                    )}
                </div>

                {/* Recent Applications */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3>Recent Applications</h3>
                        <Link to="/admin/applications" className="admin-card-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>View all <Icon name="arrow-right" size="xs" /></Link>
                    </div>
                    {recentApps?.length ? (
                        <div className="admin-mini-list">
                            {recentApps.map(a => (
                                <div className="admin-mini-item" key={a.id}>
                                    <div className="admin-mini-avatar" style={{ background: '#7c3aed20', color: '#7c3aed' }}>
                                        {a.name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="admin-mini-body">
                                        <div className="admin-mini-name">{a.name} {a.company ? `· ${a.company}` : ''}</div>
                                        <div className="admin-mini-sub">{a.service_type}</div>
                                    </div>
                                    <span className={`admin-badge ${statusCls[a.status] || 'badge-blue'}`}>{a.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                            <Icon name="state-empty" size="lg" ariaLabel="No data" style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p className="admin-empty">No applications yet</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

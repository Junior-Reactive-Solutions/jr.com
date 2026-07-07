import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../assets/icons/components/Icon';
import { getAnalytics } from '../../services/adminService';

function StatPill({ label, value, color }) {
    return (
        <div className={`admin-analytics-pill admin-stat-${color}`}>
            <div className="admin-stat-total">{value}</div>
            <div className="admin-stat-label">{label}</div>
        </div>
    );
}

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
                    <div className="admin-bar" style={{ height: `${Math.max((d.total / max) * 100, d.total > 0 ? 6 : 2)}%` }} />
                    <div className="admin-bar-label">{d.label}</div>
                </div>
            ))}
        </div>
    );
}

export default function AdminAnalytics() {
    const [data,    setData]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalytics()
            .then(res => { if (res.success) setData(res.data); })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <AdminLayout><div className="admin-loading"><div className="admin-spinner" /></div></AdminLayout>
    );

    const totalDevices = data?.devices?.reduce((s, d) => s + parseInt(d.total), 0) || 1;

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Analytics</h1>
                    <p className="admin-page-sub">Custom page view tracking — last 30 days</p>
                </div>
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
                    className="admin-btn admin-btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Open Google Analytics <Icon name="external" size="xs" />
                </a>
            </div>

            {/* Summary pills */}
            <div className="admin-analytics-pills">
                <StatPill label="Total Views" value={data?.total    || 0} color="blue"   />
                <StatPill label="Today"        value={data?.today    || 0} color="green"  />
                <StatPill label="This Week"    value={data?.thisWeek || 0} color="purple" />
            </div>

            {/* Chart */}
            <div className="admin-card" style={{ marginBottom: 24 }}>
                <div className="admin-card-header"><h3>Page Views — Last 7 Days</h3></div>
                <BarChart data={data?.chart} />
            </div>

            <div className="admin-row-2">
                {/* Top pages */}
                <div className="admin-card">
                    <div className="admin-card-header"><h3>Top Pages (30 days)</h3></div>
                    {data?.topPages?.length ? (
                        <div className="admin-top-pages">
                            {data.topPages.map((p, i) => (
                                <div className="admin-top-page-row" key={i}>
                                    <span className="admin-top-page-num">{i + 1}</span>
                                    <span className="admin-top-page-path">{p.page_path || '/'}</span>
                                    <div className="admin-top-page-bar-wrap">
                                        <div className="admin-top-page-bar"
                                            style={{ width: `${(p.total / (data.topPages[0]?.total || 1)) * 100}%` }} />
                                    </div>
                                    <span className="admin-top-page-count">{p.total}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                            <Icon name="state-empty" size="lg" ariaLabel="No data" style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p className="admin-empty">No data yet</p>
                        </div>
                    )}
                </div>

                {/* Device breakdown */}
                <div className="admin-card">
                    <div className="admin-card-header"><h3>Device Breakdown (30 days)</h3></div>
                    {data?.devices?.length ? (
                        <div className="admin-device-list">
                            {data.devices.map((d, i) => {
                                const pct = Math.round((parseInt(d.total) / totalDevices) * 100);
                                const icons = { mobile: 'mobile', tablet: 'tablet', desktop: 'desktop' };
                                return (
                                    <div className="admin-device-row" key={i}>
                                        <span className="admin-device-icon"><Icon name={icons[d.device_type] || 'desktop'} size="md" color="primary" ariaLabel={d.device_type} /></span>
                                        <div className="admin-device-info">
                                            <div className="admin-device-name">
                                                {d.device_type?.charAt(0).toUpperCase() + d.device_type?.slice(1)}
                                            </div>
                                            <div className="admin-device-bar-wrap">
                                                <div className="admin-device-bar" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <span className="admin-device-pct">{pct}%</span>
                                        <span className="admin-top-page-count">{d.total}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                            <Icon name="state-empty" size="lg" ariaLabel="No data" style={{ marginBottom: 16, opacity: 0.5 }} />
                            <p className="admin-empty">No device data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* GA embed note */}
            <div className="admin-card admin-ga-note">
                <div className="admin-ga-note-icon"><Icon name="analytics" size="lg" color="primary" /></div>
                <div>
                    <h4>Google Analytics also connected</h4>
                    <p>Full funnel analytics, acquisition data, and real-time visitors are available in your Google Analytics dashboard. Add your GA Measurement ID to <code>frontend/.env</code> as <code>REACT_APP_GA_ID</code> to activate it.</p>
                </div>
            </div>
        </AdminLayout>
    );
}

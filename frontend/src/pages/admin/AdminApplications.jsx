import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getApplications, updateAppStatus, deleteApplication } from '../../services/adminService';
import Icon from '../../assets/icons/components/Icon';

const fmt = (ts) => ts ? new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const STATUS_OPTS = ['new', 'reviewed', 'accepted', 'rejected'];
const statusCls   = { new: 'badge-blue', reviewed: 'badge-yellow', accepted: 'badge-green', rejected: 'badge-red' };

// ── Detail Modal ──────────────────────────────────────────────────────────────
function AppModal({ app, onClose, onStatusChange }) {
    const [status,  setStatus]  = useState(app.status);
    const [loading, setLoading] = useState(false);

    const handleStatus = async (s) => {
        setLoading(true);
        const res = await updateAppStatus(app.id, s);
        if (res.success) { setStatus(s); onStatusChange(app.id, s); }
        setLoading(false);
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>Application — {app.name}</h3>
                    <button className="admin-modal-close" onClick={onClose}><Icon name="close" size="sm" /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-app-detail-grid">
                        <div className="admin-msg-detail-row"><span className="admin-msg-detail-key">Name</span><span>{app.name}</span></div>
                        <div className="admin-msg-detail-row"><span className="admin-msg-detail-key">Email</span><a href={`mailto:${app.email}`} className="admin-link">{app.email}</a></div>
                        {app.company && <div className="admin-msg-detail-row"><span className="admin-msg-detail-key">Company</span><span>{app.company}</span></div>}
                        {app.phone   && <div className="admin-msg-detail-row"><span className="admin-msg-detail-key">Phone</span><a href={`tel:${app.phone}`} className="admin-link">{app.phone}</a></div>}
                        <div className="admin-msg-detail-row"><span className="admin-msg-detail-key">Service</span><span className="admin-badge badge-purple">{app.service_type}</span></div>
                        <div className="admin-msg-detail-row"><span className="admin-msg-detail-key">Received</span><span>{fmt(app.submitted_at)}</span></div>
                    </div>
                    <div className="admin-msg-body">
                        <p className="admin-original-label">Requirements / Message</p>
                        <p>{app.requirements}</p>
                    </div>
                    <div className="admin-form-group">
                        <label>Update Status</label>
                        <div className="admin-status-buttons">
                            {STATUS_OPTS.map(s => (
                                <button
                                    key={s}
                                    className={`admin-btn ${status === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                                    onClick={() => handleStatus(s)}
                                    disabled={loading || status === s}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={onClose}>Close</button>
                    <a href={`mailto:${app.email}?subject=Re: ${encodeURIComponent(app.service_type)} Application`}
                        className="admin-btn admin-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="email" size="xs" color="white" /> Email Applicant
                    </a>
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminApplications() {
    const [apps,    setApps]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState('all');
    const [viewing, setViewing] = useState(null);
    const [toast,   setToast]   = useState('');

    useEffect(() => {
        getApplications()
            .then(res => { if (res.success) setApps(res.data); })
            .finally(() => setLoading(false));
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete application from ${name}?`)) return;
        await deleteApplication(id);
        setApps(prev => prev.filter(a => a.id !== id));
        showToast('Application deleted.');
    };

    const handleStatusChange = (id, status) => {
        setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        showToast(`Status updated to "${status}"`);
    };

    const newCount = apps.filter(a => a.status === 'new').length;

    const filtered = filter === 'all'
        ? apps
        : apps.filter(a => a.status === filter);

    return (
        <AdminLayout newAppsCount={newCount}>
            {toast && <div className="admin-toast">{toast}</div>}
            {viewing && (
                <AppModal
                    app={viewing}
                    onClose={() => setViewing(null)}
                    onStatusChange={handleStatusChange}
                />
            )}

            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Service Applications</h1>
                    <p className="admin-page-sub">{apps.length} total · {newCount} pending review</p>
                </div>
            </div>

            <div className="admin-filter-bar">
                {['all', ...STATUS_OPTS].map(f => (
                    <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div className="admin-card admin-table-card">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon"><Icon name="notes" size="xl" color="muted" /></div>
                        <p>No applications here</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Service</th>
                                <th>Company</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        <div className="admin-table-person">
                                            <div className="admin-mini-avatar admin-mini-avatar-sm"
                                                style={{ background: '#7c3aed20', color: '#7c3aed' }}>
                                                {a.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="admin-table-name">{a.name}</div>
                                                <div className="admin-table-sub">{a.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="admin-badge badge-purple">{a.service_type}</span></td>
                                    <td className="admin-table-sub">{a.company || '—'}</td>
                                    <td className="admin-table-date">{fmt(a.submitted_at)}</td>
                                    <td>
                                        <span className={`admin-badge ${statusCls[a.status] || 'badge-gray'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="View details" onClick={() => setViewing(a)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                            <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => handleDelete(a.id, a.name)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}

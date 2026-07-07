import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getMessages, replyToMessage, deleteMessage, markMessageRead } from '../../services/adminService';
import Icon from '../../assets/icons/components/Icon';

const fmt = (ts) => ts ? new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

// ── Reply Modal ───────────────────────────────────────────────────────────────
function ReplyModal({ message, onClose, onSent }) {
    const [body,    setBody]    = useState('');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const handleSend = async () => {
        if (!body.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await replyToMessage(message.id, body);
            if (res.success) { onSent(); onClose(); }
            else setError(res.error || 'Send failed.');
        } catch { setError('Connection error.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>Reply to {message.name}</h3>
                    <button className="admin-modal-close" onClick={onClose}><Icon name="close" size="sm" /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-reply-meta">
                        <span><strong>To:</strong> {message.name} &lt;{message.email}&gt;</span>
                        <span><strong>Subject:</strong> Re: {message.subject}</span>
                    </div>
                    <div className="admin-original-msg">
                        <p className="admin-original-label">Original message:</p>
                        <p>{message.message}</p>
                    </div>
                    <div className="admin-form-group">
                        <label>Your Reply</label>
                        <textarea
                            className="admin-textarea"
                            rows={7}
                            placeholder="Type your reply here…"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {error && <div className="admin-alert admin-alert-error">{error}</div>}
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="admin-btn admin-btn-primary" onClick={handleSend} disabled={loading || !body.trim()}>
                        {loading ? <><span className="admin-spinner-sm" /> Sending…</> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="email" size="xs" color="white" /> Send Reply</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ message, onClose, onReply }) {
    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>{message.subject}</h3>
                    <button className="admin-modal-close" onClick={onClose}><Icon name="close" size="sm" /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-msg-details">
                        <div className="admin-msg-detail-row">
                            <span className="admin-msg-detail-key">From</span>
                            <span>{message.name} — <a href={`mailto:${message.email}`} className="admin-link">{message.email}</a></span>
                        </div>
                        <div className="admin-msg-detail-row">
                            <span className="admin-msg-detail-key">Received</span>
                            <span>{fmt(message.submitted_at)}</span>
                        </div>
                        {message.replied_at && (
                            <div className="admin-msg-detail-row">
                                <span className="admin-msg-detail-key">Replied</span>
                                <span className="admin-text-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size="xs" color="success" /> {fmt(message.replied_at)}</span>
                            </div>
                        )}
                    </div>
                    <div className="admin-msg-body">
                        <p>{message.message}</p>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={onClose}>Close</button>
                    <button className="admin-btn admin-btn-primary" onClick={onReply} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="messages" size="xs" color="white" /> Reply to this message
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [filter,   setFilter]   = useState('all'); // 'all' | 'unread' | 'replied'
    const [viewing,  setViewing]  = useState(null);
    const [replying, setReplying] = useState(null);
    const [toast,    setToast]    = useState('');

    const load = () => {
        setLoading(true);
        getMessages()
            .then(res => { if (res.success) setMessages(res.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete message from ${name}? This cannot be undone.`)) return;
        await deleteMessage(id);
        setMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted.');
    };

    const handleMarkRead = async (id) => {
        await markMessageRead(id);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    };

    const unread = messages.filter(m => !m.is_read).length;

    const filtered = messages.filter(m => {
        if (filter === 'unread')  return !m.is_read;
        if (filter === 'replied') return !!m.replied_at;
        return true;
    });

    return (
        <AdminLayout unreadCount={unread}>
            {toast && <div className="admin-toast">{toast}</div>}
            {viewing  && <ViewModal  message={viewing}  onClose={() => setViewing(null)}  onReply={() => { setReplying(viewing); setViewing(null); }} />}
            {replying && <ReplyModal message={replying} onClose={() => setReplying(null)} onSent={() => { showToast(`Reply sent to ${replying.email}`); load(); }} />}

            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Messages</h1>
                    <p className="admin-page-sub">{messages.length} total · {unread} unread</p>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-filter-bar">
                {['all','unread','replied'].map(f => (
                    <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'unread' && unread > 0 && <span className="admin-nav-badge" style={{marginLeft:6}}>{unread}</span>}
                    </button>
                ))}
            </div>

            <div className="admin-card admin-table-card">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon"><Icon name="email" size="xl" color="muted" /></div>
                        <p>No messages here</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(m => (
                                <tr key={m.id} className={!m.is_read ? 'row-unread' : ''}>
                                    <td>
                                        <div className="admin-table-person">
                                            <div className="admin-mini-avatar admin-mini-avatar-sm">{m.name?.[0]?.toUpperCase()}</div>
                                            <div>
                                                <div className="admin-table-name">{m.name}</div>
                                                <div className="admin-table-sub">{m.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="admin-table-subject">
                                        {!m.is_read && <span className="admin-unread-dot" style={{marginRight:6}} />}
                                        {m.subject}
                                    </td>
                                    <td className="admin-table-date">{fmt(m.submitted_at)}</td>
                                    <td>
                                        {m.replied_at
                                            ? <span className="admin-badge badge-green">Replied</span>
                                            : m.is_read
                                                ? <span className="admin-badge badge-gray">Read</span>
                                                : <span className="admin-badge badge-blue">New</span>
                                        }
                                    </td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="View message" onClick={() => { setViewing(m); handleMarkRead(m.id); }}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                            <button className="admin-icon-btn" title="Reply" onClick={() => setReplying(m)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
                                            </button>
                                            <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => handleDelete(m.id, m.name)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6 M14 11v6"/><path d="M9 6V4h6v2"/></svg>
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

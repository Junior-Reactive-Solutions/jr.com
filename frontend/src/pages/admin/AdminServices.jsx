import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { createService, updateService, deleteService } from '../../services/adminService';
import Icon from '../../assets/icons/components/Icon';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5005';

async function fetchServices() {
    const res  = await fetch(`${API}/api/services`, { credentials: 'include' });
    const data = await res.json();
    return data.success ? data.data : [];
}

const EMPTY_FORM = { key: '', title: '', icon: 'settings', shortDescription: '', fullDescription: '' };

// ── Service Modal ─────────────────────────────────────────────────────────────
function ServiceModal({ service, onClose, onSaved }) {
    const isEdit = !!service?.id;
    const [form,    setForm]    = useState(service ? {
        key: service.key || '', title: service.title || '', icon: service.icon || 'settings',
        shortDescription: service.shortDescription || '', fullDescription: service.fullDescription || '',
    } : { ...EMPTY_FORM });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

    const handleSave = async () => {
        if (!form.title || !form.shortDescription) {
            setError('Title and short description are required.'); return;
        }
        if (!isEdit && !form.key) { setError('Service key is required.'); return; }
        setLoading(true); setError('');
        try {
            const res = isEdit
                ? await updateService(service.id, form)
                : await createService(form);
            if (res.success) onSaved();
            else setError(res.error || 'Save failed.');
        } catch { setError('Connection error.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>{isEdit ? 'Edit Service' : 'Add New Service'}</h3>
                    <button className="admin-modal-close" onClick={onClose}><Icon name="close" size="sm" /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-row-2">
                        {!isEdit && (
                            <div className="admin-form-group">
                                <label>Service Key <span className="admin-label-hint">(URL slug, no spaces)</span></label>
                                <input className="admin-input" placeholder="e.g. ai-consulting" value={form.key} onChange={set('key')} />
                            </div>
                        )}
                        <div className="admin-form-group">
                            <label>Icon <span className="admin-label-hint">(name, e.g. ai, cloud, rocket)</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input className="admin-input" placeholder="e.g. ai" value={form.icon} onChange={set('icon')} style={{ width: 160 }} />
                                <span style={{ display: 'inline-flex', padding: 6, border: '1px solid var(--color-border, #e4eaf9)', borderRadius: 8 }}><Icon name={form.icon || 'settings'} size="md" color="primary" /></span>
                            </div>
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Title *</label>
                        <input className="admin-input" placeholder="e.g. AI Consulting" value={form.title} onChange={set('title')} />
                    </div>
                    <div className="admin-form-group">
                        <label>Short Description * <span className="admin-label-hint">(used on cards)</span></label>
                        <textarea className="admin-textarea" rows={2} placeholder="One-line summary of the service"
                            value={form.shortDescription} onChange={set('shortDescription')} />
                    </div>
                    <div className="admin-form-group">
                        <label>Full Description <span className="admin-label-hint">(detail page)</span></label>
                        <textarea className="admin-textarea" rows={5} placeholder="Full description shown on the service detail page"
                            value={form.fullDescription} onChange={set('fullDescription')} />
                    </div>
                    {error && <div className="admin-alert admin-alert-error">{error}</div>}
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? <><span className="admin-spinner-sm" /> Saving…</> : isEdit ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size="xs" color="white" /> Save Changes</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="plus" size="xs" color="white" /> Add Service</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [modal,    setModal]    = useState(null); // null | 'add' | service obj
    const [toast,    setToast]    = useState('');

    const load = () => {
        setLoading(true);
        fetchServices().then(setServices).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This will remove it from the website.`)) return;
        await deleteService(id);
        setServices(prev => prev.filter(s => s.id !== id));
        showToast(`"${title}" deleted.`);
    };

    const handleSaved = () => {
        setModal(null);
        showToast('Service saved successfully');
        load();
    };

    return (
        <AdminLayout>
            {toast && <div className="admin-toast">{toast}</div>}
            {modal && (
                <ServiceModal
                    service={modal === 'add' ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}

            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Services</h1>
                    <p className="admin-page-sub">{services.length} services on your website</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => setModal('add')}>
                    + Add Service
                </button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /></div>
            ) : (
                <div className="admin-services-grid">
                    {services.map(s => (
                        <div className="admin-service-card" key={s.id}>
                            <div className="admin-service-icon"><Icon name={s.icon || 'settings'} size="lg" color="primary" ariaLabel={`${s.title} icon`} /></div>
                            <div className="admin-service-body">
                                <h4 className="admin-service-title">{s.title}</h4>
                                <p className="admin-service-desc">{s.shortDescription}</p>
                            </div>
                            <div className="admin-service-actions">
                                <button className="admin-icon-btn" title="Edit" onClick={() => setModal(s)}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => handleDelete(s.id, s.title)}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add card */}
                    <button className="admin-service-add-card" onClick={() => setModal('add')}>
                        <span className="admin-service-add-icon">+</span>
                        <span>Add New Service</span>
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}

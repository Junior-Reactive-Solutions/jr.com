import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminErrorState from '../../components/admin/AdminErrorState';
import { getFAQsAdmin, createFAQ, updateFAQ, deleteFAQ, reorderFAQs } from '../../services/adminService';
import { ConfirmDialog, useToast } from '../../components/ui';
import Icon from '../../assets/icons/components/Icon';

const EMPTY_FORM = { question: '', answer: '' };

// ── FAQ Modal ─────────────────────────────────────────────────────────────────
function FAQModal({ faq, onClose, onSaved }) {
    const isEdit = !!faq?.id;
    const [form,    setForm]    = useState(faq ? { question: faq.question, answer: faq.answer } : { ...EMPTY_FORM });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

    const handleSave = async () => {
        if (!form.question.trim() || !form.answer.trim()) {
            setError('Question and answer are both required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = isEdit ? await updateFAQ(faq.id, form) : await createFAQ(form);
            if (res.success) onSaved();
            else setError(res.error || 'Save failed.');
        } catch {
            setError('Connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>{isEdit ? 'Edit FAQ' : 'Add FAQ'}</h3>
                    <button className="admin-modal-close" onClick={onClose}><Icon name="close" size="sm" /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-group">
                        <label>Question *</label>
                        <input className="admin-input" placeholder="e.g. How long does a typical project take?" value={form.question} onChange={set('question')} />
                    </div>
                    <div className="admin-form-group">
                        <label>Answer *</label>
                        <textarea className="admin-textarea" rows={6} placeholder="A clear, specific answer." value={form.answer} onChange={set('answer')} />
                    </div>
                    {error && <div className="admin-alert admin-alert-error">{error}</div>}
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? <><span className="admin-spinner-sm" /> Saving…</> : isEdit ? 'Save changes' : 'Add FAQ'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminFAQs() {
    const [faqs,     setFaqs]     = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const [modal,    setModal]    = useState(null); // null | 'add' | faq obj
    const [toDelete, setToDelete] = useState(null); // { id, question }
    const toast = useToast();

    const load = () => {
        setLoading(true);
        setError('');
        getFAQsAdmin()
            .then((res) => {
                if (res.success) setFaqs(res.data);
                else setError(res.error || 'Could not load FAQs.');
            })
            .catch(() => setError('Could not connect to the server.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const confirmDelete = async () => {
        const { id, question } = toDelete;
        setToDelete(null);
        await deleteFAQ(id);
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        toast.show(`Deleted "${question.slice(0, 40)}${question.length > 40 ? '…' : ''}"`, { tone: 'success' });
    };

    const handleSaved = () => {
        setModal(null);
        toast.show('FAQ saved.', { tone: 'success' });
        load();
    };

    const move = async (index, dir) => {
        const target = index + dir;
        if (target < 0 || target >= faqs.length) return;
        const next = [...faqs];
        [next[index], next[target]] = [next[target], next[index]];
        setFaqs(next);
        await reorderFAQs(next.map((f) => f.id));
    };

    return (
        <AdminLayout>
            {modal && (
                <FAQModal
                    faq={modal === 'add' ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}
            <ConfirmDialog
                open={!!toDelete}
                title="Delete FAQ"
                message={toDelete ? `Delete "${toDelete.question}"? This removes it from the public FAQ page.` : ''}
                confirmLabel="Delete"
                danger
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />

            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">FAQs</h1>
                    <p className="admin-page-sub">{faqs.length} questions on the public FAQ page</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => setModal('add')}>+ Add FAQ</button>
            </div>

            <div className="admin-card admin-table-card">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : error ? (
                    <AdminErrorState message={error} onRetry={load} />
                ) : faqs.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon"><Icon name="faq" size="xl" color="muted" /></div>
                        <p>No FAQs yet</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: 70 }}>Order</th>
                                <th>Question</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs.map((f, i) => (
                                <tr key={f.id}>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
                                            </button>
                                            <button className="admin-icon-btn" title="Move down" disabled={i === faqs.length - 1} onClick={() => move(i, 1)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="admin-table-subject">{f.question}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="Edit" onClick={() => setModal(f)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => setToDelete({ id: f.id, question: f.question })}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>
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

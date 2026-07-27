import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminErrorState from '../../components/admin/AdminErrorState';
import { getBlogPostsAdmin, createBlogPost, updateBlogPost, deleteBlogPost } from '../../services/adminService';
import { ConfirmDialog, useToast } from '../../components/ui';
import Icon from '../../assets/icons/components/Icon';

const fmt = (ts) => ts ? new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const slugify = (str) => String(str || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);

const todayISO = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM = { title: '', slug: '', excerpt: '', content: '', author: 'Junior Reactive Team', publishDate: todayISO() };

// ── Post Modal ────────────────────────────────────────────────────────────────
function PostModal({ post, onClose, onSaved }) {
    const isEdit = !!post?.id;
    const [form, setForm] = useState(post ? {
        title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content || '',
        author: post.author, publishDate: post.publishDate ? String(post.publishDate).slice(0, 10) : todayISO(),
    } : { ...EMPTY_FORM });
    const [slugTouched, setSlugTouched] = useState(isEdit);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const set = (f) => (e) => {
        const value = e.target.value;
        setForm((prev) => {
            const next = { ...prev, [f]: value };
            if (f === 'title' && !slugTouched) next.slug = slugify(value);
            return next;
        });
        if (f === 'slug') setSlugTouched(true);
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.author.trim()) {
            setError('Title, excerpt, content, and author are all required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const payload = { ...form, slug: slugify(form.slug || form.title) };
            const res = isEdit ? await updateBlogPost(post.id, payload) : await createBlogPost(payload);
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
                    <h3>{isEdit ? 'Edit post' : 'New post'}</h3>
                    <button className="admin-modal-close" onClick={onClose}><Icon name="close" size="sm" /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-group">
                        <label>Title *</label>
                        <input className="admin-input" placeholder="e.g. Five automations every logistics business needs" value={form.title} onChange={set('title')} />
                    </div>
                    <div className="admin-form-group">
                        <label>Slug <span className="admin-label-hint">— /blog/{form.slug || 'your-slug-here'}</span></label>
                        <input className="admin-input" placeholder="auto-generated-from-title" value={form.slug} onChange={set('slug')} />
                    </div>
                    <div className="admin-form-row-2">
                        <div className="admin-form-group">
                            <label>Author *</label>
                            <input className="admin-input" placeholder="Junior Reactive Team" value={form.author} onChange={set('author')} />
                        </div>
                        <div className="admin-form-group">
                            <label>Publish date</label>
                            <input className="admin-input" type="date" value={form.publishDate} onChange={set('publishDate')} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Excerpt * <span className="admin-label-hint">— shown on the blog list page</span></label>
                        <textarea className="admin-textarea" rows={2} placeholder="A one or two sentence summary." value={form.excerpt} onChange={set('excerpt')} />
                    </div>
                    <div className="admin-form-group">
                        <label>Content *</label>
                        <textarea className="admin-textarea" rows={12} style={{ minHeight: 260, fontFamily: 'var(--font-mono)', fontSize: '.82rem' }} placeholder="Full post body. Separate paragraphs with a blank line." value={form.content} onChange={set('content')} />
                    </div>
                    {error && <div className="admin-alert admin-alert-error">{error}</div>}
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? <><span className="admin-spinner-sm" /> Saving…</> : isEdit ? 'Save changes' : 'Publish post'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminBlog() {
    const [posts,    setPosts]    = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const [search,   setSearch]   = useState('');
    const [modal,    setModal]    = useState(null); // null | 'add' | post obj
    const [toDelete, setToDelete] = useState(null); // { id, title }
    const toast = useToast();

    const load = () => {
        setLoading(true);
        setError('');
        getBlogPostsAdmin()
            .then((res) => {
                if (res.success) setPosts(res.data);
                else setError(res.error || 'Could not load blog posts.');
            })
            .catch(() => setError('Could not connect to the server.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return posts;
        return posts.filter((p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
    }, [posts, search]);

    const confirmDelete = async () => {
        const { id, title } = toDelete;
        setToDelete(null);
        await deleteBlogPost(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.show(`"${title}" deleted.`, { tone: 'success' });
    };

    const handleSaved = () => {
        setModal(null);
        toast.show('Post saved.', { tone: 'success' });
        load();
    };

    return (
        <AdminLayout>
            {modal && (
                <PostModal
                    post={modal === 'add' ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}
            <ConfirmDialog
                open={!!toDelete}
                title="Delete post"
                message={toDelete ? `Delete "${toDelete.title}"? This removes it from the public blog immediately.` : ''}
                confirmLabel="Delete"
                danger
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />

            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Blog</h1>
                    <p className="admin-page-sub">{posts.length} posts published</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => setModal('add')}>+ New post</button>
            </div>

            <div className="admin-filter-bar">
                <input
                    className="admin-input admin-search-input"
                    type="search"
                    placeholder="Search title, author…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="admin-card admin-table-card">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : error ? (
                    <AdminErrorState message={error} onRetry={load} />
                ) : filtered.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon"><Icon name="blog" size="xl" color="muted" /></div>
                        <p>No posts yet</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="admin-table-name">{p.title}</div>
                                        <div className="admin-table-sub">/blog/{p.slug}</div>
                                    </td>
                                    <td className="admin-table-sub">{p.author}</td>
                                    <td className="admin-table-date">{fmt(p.publishDate)}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <a className="admin-icon-btn" title="View live" href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">
                                                <Icon name="external" size="xs" ariaLabel="" />
                                            </a>
                                            <button className="admin-icon-btn" title="Edit" onClick={() => setModal(p)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button className="admin-icon-btn admin-icon-btn-danger" title="Delete" onClick={() => setToDelete({ id: p.id, title: p.title })}>
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

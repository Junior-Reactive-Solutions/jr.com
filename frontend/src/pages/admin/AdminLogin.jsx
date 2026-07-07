import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminService';
import Icon from '../../assets/icons/components/Icon';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await adminLogin(password);
            if (res.success) {
                navigate('/admin/dashboard');
            } else {
                setError(res.error || 'Login failed.');
            }
        } catch {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                {/* Brand */}
                <div className="admin-login-brand">
                    <div className="admin-login-logo">
                        <span className="brand-j">J</span><span className="brand-r">R</span>
                    </div>
                    <h1 className="admin-login-title">Admin Panel</h1>
                    <p className="admin-login-sub">Junior Reactive · Kampala, Uganda</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label htmlFor="admin-password">Password</label>
                        <div className="admin-input-wrap">
                            <svg className="admin-input-icon" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                            <input
                                id="admin-password"
                                type="password"
                                className="admin-input"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="admin-alert admin-alert-error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="admin-btn admin-btn-primary admin-btn-full" disabled={loading}>
                        {loading ? (
                            <><span className="admin-spinner-sm" /> Signing in…</>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="admin-login-footer">
                    <a href="/" className="admin-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="arrow-left" size="xs" /> Back to website</a>
                </p>
            </div>
        </div>
    );
}

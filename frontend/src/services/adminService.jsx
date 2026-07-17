const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const opts = (method, body) => ({
    method,
    credentials: 'include',      // send httpOnly cookie
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
});

async function request(path, method = 'GET', body = null) {
    const res = await fetch(`${BASE}${path}`, opts(method, body));
    const data = await res.json();
    if (!data.success && res.status === 401) {
        // Redirect to login
        window.location.href = '/admin/login';
        throw new Error('Unauthenticated');
    }
    return data;
}

// Auth
export const adminLogin   = (password) => request('/api/admin/login', 'POST', { password });
export const adminLogout  = ()          => request('/api/admin/logout', 'POST');
export const adminVerify  = ()          => request('/api/admin/verify');

// Dashboard
export const getDashboard = () => request('/api/admin/dashboard');

// Messages
export const getMessages     = (params = '') => request(`/api/admin/messages${params}`);
export const getMessage      = (id)           => request(`/api/admin/messages/${id}`);
export const replyToMessage  = (id, body)     => request(`/api/admin/messages/${id}/reply`, 'POST', { replyBody: body });
export const markMessageRead = (id)           => request(`/api/admin/messages/${id}/read`, 'PATCH');
export const deleteMessage   = (id)           => request(`/api/admin/messages/${id}`, 'DELETE');

// Applications
export const getApplications    = ()          => request('/api/admin/applications');
export const getApplication     = (id)        => request(`/api/admin/applications/${id}`);
export const updateAppStatus    = (id, status) => request(`/api/admin/applications/${id}/status`, 'PATCH', { status });
export const deleteApplication  = (id)        => request(`/api/admin/applications/${id}`, 'DELETE');

// Services
export const createService = (data) => request('/api/admin/services', 'POST', data);
export const updateService = (id, data) => request(`/api/admin/services/${id}`, 'PUT', data);
export const deleteService = (id) => request(`/api/admin/services/${id}`, 'DELETE');

// Analytics
export const getAnalytics = () => request('/api/admin/analytics');

// Page view tracking
export const trackPageView = (path, sessionId, referrer) =>
    fetch(`${BASE}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, sessionId, referrer }),
    }).catch(() => {}); // never throw

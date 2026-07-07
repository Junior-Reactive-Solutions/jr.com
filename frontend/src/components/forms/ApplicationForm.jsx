import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submissionService } from '../../services/submissionService';
import Button from '../common/Button';
import Icon from '../../assets/icons/components/Icon';

const SERVICES = [
    'General Inquiry',
    'AI Consulting',
    'Custom Software Development',
    'Data Analytics & Insights',
    'Cloud Solutions',
    'Predictive Modeling',
    'AI Awareness Session',
];

const ApplicationForm = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        company: '', name: '', email: '', phone: '',
        service_type: 'General Inquiry', requirements: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const serviceParam = searchParams.get('service');
        if (serviceParam) {
            setFormData((prev) => ({ ...prev, service_type: serviceParam }));
        }
    }, [searchParams]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await submissionService.submitApplication(formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: response.data.message || 'Application submitted! Our team will reach out shortly.' });
                setFormData({ company: '', name: '', email: '', phone: '', service_type: 'General Inquiry', requirements: '' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.userMessage || error.response?.data?.error || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <form onSubmit={handleSubmit}>
                {/* Section: Client Info */}
                <div style={{ marginBottom: 32 }}>
                    <h3 style={{ marginBottom: 4, fontSize: '1.1rem' }}>Client Information</h3>
                    <p style={{ fontSize: '0.875rem', marginBottom: 20 }}>Tell us a bit about yourself and your organisation.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label htmlFor="company">Company Name</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Ltd." />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Contact Person *</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+256 7XX XXX XXX" />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="divider" />

                {/* Section: Project */}
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 4, fontSize: '1.1rem' }}>Project Details</h3>
                    <p style={{ fontSize: '0.875rem', marginBottom: 20 }}>Help us understand what you need.</p>

                    <div className="form-group">
                        <label htmlFor="service_type">Service Interested In *</label>
                        <select id="service_type" name="service_type" value={formData.service_type} onChange={handleChange}>
                            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="requirements">Project Requirements *</label>
                        <textarea
                            id="requirements" name="requirements" rows={6}
                            value={formData.requirements} onChange={handleChange}
                            placeholder="Describe your project goals, timeline, budget expectations, current challenges…"
                            required style={{ resize: 'vertical' }}
                        />
                    </div>
                </div>

                {status.message && (
                    <div className={`alert alert-${status.type}`}>
                        <Icon name={status.type === 'success' ? 'success' : 'error'} size="sm" color={status.type === 'success' ? 'success' : 'error'} ariaLabel={status.type} />
                        <span>{status.message}</span>
                    </div>
                )}

                <Button type="submit" disabled={loading} fullWidth>
                    {loading ? 'Submitting…' : 'Submit Application'}
                </Button>
            </form>

            <style>{`
                @media (max-width: 600px) {
                    form > div:first-child > div[style*="grid"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default ApplicationForm;

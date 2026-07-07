import React, { useState } from 'react';
import { submissionService } from '../../services/submissionService';
import Button from '../common/Button';
import Icon from '../../assets/icons/components/Icon';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await submissionService.submitContact(formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: response.data.message || 'Message sent! We\'ll be in touch soon.' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: error.userMessage || error.response?.data?.error || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <h3 style={{ marginBottom: 6 }}>Send a Message</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: 24 }}>We usually respond within 24 hours.</p>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text" id="name" name="name"
                            value={formData.name} onChange={handleChange}
                            placeholder="John Doe" required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email" id="email" name="email"
                            value={formData.email} onChange={handleChange}
                            placeholder="john@company.com" required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                        type="text" id="subject" name="subject"
                        value={formData.subject} onChange={handleChange}
                        placeholder="What's this about?" required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                        id="message" name="message" rows={5}
                        value={formData.message} onChange={handleChange}
                        placeholder="Tell us what you need..." required
                        style={{ resize: 'vertical' }}
                    />
                </div>

                {status.message && (
                    <div className={`alert alert-${status.type}`}>
                        <Icon name={status.type === 'success' ? 'success' : 'error'} size="sm" color={status.type === 'success' ? 'success' : 'error'} ariaLabel={status.type} />
                        <span>{status.message}</span>
                    </div>
                )}

                <Button type="submit" disabled={loading} fullWidth>
                    {loading ? 'Sending…' : 'Send Message'}
                </Button>
            </form>

            <style>{`
                @media (max-width: 480px) {
                    form > div:first-child { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default ContactForm;

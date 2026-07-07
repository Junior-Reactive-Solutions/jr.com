import React, { useState } from 'react';
import { submissionService } from '../services/submissionService';
import Icon from '../assets/icons/components/Icon';

const CONTACT_DETAILS = [
    { icon: 'phone',    label: 'Phone / WhatsApp', value: '+256 764 524 816', href: 'tel:+256764524816' },
    { icon: 'email',    label: 'Email', value: 'juniorreactive@gmail.com', href: 'mailto:juniorreactive@gmail.com' },
    { icon: 'location', label: 'Location', value: 'Kampala, Uganda', href: null },
    { icon: 'time',     label: 'Response Time', value: 'Within 24 hours', href: null },
];

const ContactPage = () => {
    const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus]   = useState(null); // 'loading' | 'success' | 'error'
    const [errMsg, setErrMsg]   = useState('');

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus('loading');
        setErrMsg('');
        try {
            await submissionService.submitContact(form);
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
            setErrMsg(err?.response?.data?.error || 'Something went wrong. Please try again.');
        }
    };

    return (
        <main>
            {/* Hero */}
            <section className="hero" style={{ padding: '80px 0 70px' }}>
                <div className="container">
                    <div className="hero-badge">Get In Touch</div>
                    <h1>Contact Us</h1>
                    <p className="hero-sub">
                        Have a question or ready to start a project? We'd love to hear from you.
                        We respond to every message within 24 hours.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="section">
                <div className="container">
                    <div className="contact-grid">

                        {/* ── LEFT: Details ───────────────────────── */}
                        <div className="contact-details">
                            <h2 style={{ marginBottom: 8 }}>Get In Touch</h2>
                            <p style={{ marginBottom: 32 }}>
                                Reach out through any of the channels below, or fill in the form
                                and we'll get back to you promptly.
                            </p>

                            <div className="contact-cards">
                                {CONTACT_DETAILS.map(item => (
                                    <div className="contact-card" key={item.label}>
                                        <span className="contact-card-icon"><Icon name={item.icon} size="md" color="primary" ariaLabel={item.label} /></span>
                                        <div>
                                            <div className="contact-card-label">{item.label}</div>
                                            {item.href ? (
                                                <a href={item.href} className="contact-card-value contact-card-link">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <div className="contact-card-value">{item.value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* WhatsApp CTA */}
                            <a
                                href="https://wa.me/256764524816?text=Hello%20Junior%20Reactive%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{ marginTop: 32, width: '100%', justifyContent: 'center' }}
                            >
                                <i className="fab fa-whatsapp" style={{ fontSize: '1.1rem' }} />
                                Chat on WhatsApp
                            </a>
                        </div>

                        {/* ── RIGHT: Form ─────────────────────────── */}
                        <div className="form-card contact-form-card">
                            <h3 style={{ marginBottom: 6 }}>Send a Message</h3>
                            <p style={{ fontSize: '.9rem', marginBottom: 24 }}>
                                Fill in the form below and we'll be in touch within 24 hours.
                            </p>

                            {status === 'success' && (
                                <div className="alert alert-success" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Icon name="success" size="sm" color="success" ariaLabel="Success" /> Message sent! We'll get back to you within 24 hours.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="alert alert-error" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Icon name="warning" size="sm" color="error" ariaLabel="Error" /> {errMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="contact-form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            id="name" name="name" type="text"
                                            placeholder="Your name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            id="email" name="email" type="email"
                                            placeholder="your@email.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        id="subject" name="subject" type="text"
                                        placeholder="What is this about?"
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message" name="message"
                                        placeholder="Tell us how we can help..."
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        style={{ resize: 'vertical', minHeight: 120 }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-full-width"
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Sending…' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Send Message <Icon name="arrow-right" size="xs" color="white" /></span>}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;

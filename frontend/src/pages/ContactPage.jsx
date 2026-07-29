import React, { useState } from 'react';
import { submissionService } from '../services/submissionService';
import PageIntro from '../components/layout/PageIntro';
import { Button, Card, Field, Kicker } from '../components/ui';
import Icon from '../assets/icons/components/Icon';

const CHANNELS = [
    { icon: 'phone',    label: 'Phone / WhatsApp', value: '+256 764 524 816', href: 'tel:+256764524816' },
    { icon: 'email',    label: 'Email', value: 'juniorreactive@gmail.com', href: 'mailto:juniorreactive@gmail.com' },
    { icon: 'location', label: 'Location', value: 'Kampala, Uganda', href: null },
    { icon: 'time',     label: 'Response time', value: 'Within 24 hours', href: null },
];

const ContactPage = () => {
    const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
    const [errMsg, setErrMsg] = useState('');

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
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
            <PageIntro
                kicker="Contact"
                title="Talk to a person, not a pipeline"
                lead="WhatsApp is fastest — most messages get a reply the same working day. The form works too; everything lands with the same small team."
            />

            <section className="v2-section">
                <div className="v2-container">
                    <div className="v2-split v2-split--offset" style={{ alignItems: 'start' }}>
                        <div>
                            <Kicker>Channels</Kicker>
                            <div className="v2-rows">
                                {CHANNELS.map((c) => (
                                    <div className="v2-row" key={c.label} style={{ cursor: 'default', gridTemplateColumns: '40px 1fr' }}>
                                        <span style={{ color: 'var(--accent-600)' }}><Icon name={c.icon} size="sm" ariaLabel="" /></span>
                                        <span>
                                            <span style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-kicker)', color: 'var(--text-muted)', marginBottom: 2 }}>{c.label}</span>
                                            {c.href
                                                ? <a href={c.href} style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{c.value}</a>
                                                : <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{c.value}</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="v2-actions">
                                <Button
                                    href="https://wa.me/256764524816?text=Hello%20Junior%20Reactive%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Chat on WhatsApp
                                </Button>
                            </div>
                        </div>

                        <Card>
                            <h2 className="v2-row-title" style={{ marginBottom: 'var(--sp-2)' }}>Send a message</h2>
                            <p className="v2-body" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-6)' }}>
                                We reply within one working day.
                            </p>

                            {status === 'success' && (
                                <p style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--status-success)', background: 'var(--status-success-bg)', padding: '10px 14px', borderRadius: 'var(--r-md)', marginBottom: 'var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                                    <Icon name="success" size="sm" ariaLabel="" /> Message sent. We'll get back to you within 24 hours.
                                </p>
                            )}
                            {status === 'error' && (
                                <p style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--status-error)', background: 'var(--status-error-bg)', padding: '10px 14px', borderRadius: 'var(--r-md)', marginBottom: 'var(--sp-4)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                                    <Icon name="warning" size="sm" ariaLabel="" /> {errMsg}
                                </p>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                                <div className="v2-grid-2">
                                    <Field label="Full name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                                    <Field label="Email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
                                </div>
                                <Field label="Subject" name="subject" placeholder="What is this about?" value={form.subject} onChange={handleChange} required />
                                <Field label="Message" name="message" as="textarea" placeholder="Tell us what you need." value={form.message} onChange={handleChange} required />
                                <Button type="submit" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Sending...' : 'Send message'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;

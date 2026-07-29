import React, { useEffect, useState } from 'react';
import {
    Button, Badge, Kicker, Card, Field, Tabs, Accordion, Modal,
    ToastProvider, useToast, EmptyState, Skeleton,
} from '../components/ui';
import './StyleguidePage.css';

// Internal design-system reference. Not linked from navigation.
// Renders tokens, type candidates, and every v2 component for sign-off.

const RAMPS = [
    { name: 'Ink (navy-derived)', stops: [['ink-950', '#0d1230'], ['ink-900', '#131a40'], ['ink-800 = brand navy', '#1c265e'], ['ink-700', '#26327a'], ['ink-600', '#303f96']] },
    { name: 'Accent (blue-derived)', stops: [['accent-700', '#3e50a3'], ['accent-600 = brand blue', '#5269c3'], ['accent-500', '#6d82cf'], ['accent-400', '#8a9bdb'], ['accent-300 = periwinkle', '#90a0da'], ['accent-200', '#bcc7ea'], ['accent-100', '#dde3f6'], ['accent-50', '#eef1fb']] },
    { name: 'Sky + wash', stops: [['sky-300 = brand sky', '#a8ccee'], ['sky-100', '#d8e8f7'], ['sky-50', '#ecf4fb'], ['wash = brand wash', '#e4eaf9']] },
    { name: 'Neutrals (navy-cast)', stops: [['neutral-700', '#414a61'], ['neutral-600', '#5a627a'], ['neutral-500', '#7e869d'], ['neutral-400', '#a8afc2'], ['neutral-300', '#cfd4e1'], ['neutral-200', '#e4e7f0'], ['neutral-100', '#f2f4f9'], ['paper', '#fcfcfe']] },
];

function ToastDemo() {
    const toast = useToast();
    return (
        <div className="sg-row">
            <Button size="sm" variant="secondary" onClick={() => toast.show('Service saved.', { tone: 'success' })}>Success toast</Button>
            <Button size="sm" variant="secondary" onClick={() => toast.show('Could not reach the server.', { tone: 'error' })}>Error toast</Button>
            <Button size="sm" variant="secondary" onClick={() => toast.show('Draft stored locally.', { tone: 'info' })}>Info toast</Button>
        </div>
    );
}

const StyleguidePage = () => {
    const [modalOpen, setModalOpen] = useState(false);

    // Load the comparison typeface (Schibsted Grotesk) only on this page.
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;600;700&display=swap';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <main className="sg">
            <header className="sg-hero">
                <Kicker>Internal reference</Kicker>
                <h1 className="sg-title">JR Design System v2</h1>
                <p className="sg-lead">
                    Quiet authority, warmly grounded. Every element on this page is built
                    from tokens.css — nothing here is styled ad hoc.
                </p>
            </header>

            <section className="sg-section">
                <h2 className="sg-h2">1. Display type candidates</h2>
                <p className="sg-note">Council resolution: characterful grotesk. Owner picks the winner.</p>
                <div className="sg-type-card">
                    <span className="sg-type-label">A. Space Grotesk (lead candidate)</span>
                    <p className="sg-specimen sg-specimen--space">Automation that pays for itself in months, not years.</p>
                </div>
                <div className="sg-type-card">
                    <span className="sg-type-label">B. Schibsted Grotesk</span>
                    <p className="sg-specimen sg-specimen--schibsted">Automation that pays for itself in months, not years.</p>
                </div>
                <div className="sg-type-card">
                    <span className="sg-type-label">Body / UI: Hanken Grotesk</span>
                    <p className="sg-specimen-body">
                        We build N8N workflows, AI assistants, and custom software for businesses
                        across East Africa. Every engagement starts with a problem worth solving —
                        not a technology looking for one. 0123456789
                    </p>
                </div>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">2. Color ramps</h2>
                <p className="sg-note">
                    Derived exclusively from the five brand blues. Ink-900 on white measures
                    about 15.9:1, accent-700 carries white text at about 7:1 (AA), accent-600
                    is for links and large text only. Status hues are functional, muted, and
                    always paired with an icon.
                </p>
                {RAMPS.map((ramp) => (
                    <div key={ramp.name} className="sg-ramp">
                        <span className="sg-ramp-name">{ramp.name}</span>
                        <div className="sg-swatches">
                            {ramp.stops.map(([label, hex]) => (
                                <div key={label} className="sg-swatch">
                                    <div className="sg-swatch-chip" style={{ background: hex }} />
                                    <span className="sg-swatch-label">{label}</span>
                                    <span className="sg-swatch-hex">{hex}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">3. Dark statement section</h2>
                <div className="sg-navy-band">
                    <Kicker onDark>How we work</Kicker>
                    <p className="sg-navy-statement">
                        Strategy, build, and support from one small team in Kampala —
                        accountable to outcomes, not hours.
                    </p>
                    <Button variant="on-dark">Talk to us</Button>
                </div>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">4. Buttons</h2>
                <div className="sg-row">
                    <Button>Primary action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button disabled>Disabled</Button>
                </div>
                <div className="sg-row">
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large call to action</Button>
                </div>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">5. Badges</h2>
                <div className="sg-row">
                    <Badge>Neutral</Badge>
                    <Badge tone="accent">Accent</Badge>
                    <Badge tone="navy">Navy</Badge>
                    <Badge tone="success">Replied</Badge>
                    <Badge tone="error">Failed</Badge>
                    <Badge tone="warning">Pending</Badge>
                </div>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">6. Form fields</h2>
                <div className="sg-form-grid">
                    <Field label="Full name" placeholder="Amina Nakato" hint="As it appears on official documents." />
                    <Field label="Email" type="email" placeholder="you@company.co.ug" error="Enter a valid email address." />
                    <Field label="Project summary" as="textarea" placeholder="What are you trying to build or automate?" />
                    <Field label="Service" as="select" defaultValue="">
                        <option value="" disabled>Select a service</option>
                        <option>N8N Automation</option>
                        <option>AI Consulting</option>
                        <option>Custom Software</option>
                    </Field>
                </div>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">7. Cards</h2>
                <div className="sg-card-grid">
                    <Card>
                        <h3 className="sg-card-title">Standard card</h3>
                        <p className="sg-card-body">Hairline border, tight radius, no shadow by default.</p>
                    </Card>
                    <Card interactive>
                        <h3 className="sg-card-title">Interactive card</h3>
                        <p className="sg-card-body">Border shifts to accent on hover — no lift, no glow.</p>
                    </Card>
                    <Card sunken>
                        <h3 className="sg-card-title">Sunken card</h3>
                        <p className="sg-card-body">Quiet fill for secondary groupings.</p>
                    </Card>
                </div>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">8. Tabs</h2>
                <Tabs
                    items={[
                        { id: 'a', label: 'Deliverables', content: <p className="sg-card-body">Working software, documentation, and a handover session.</p> },
                        { id: 'b', label: 'Timeline', content: <p className="sg-card-body">Discovery in week one; first working version inside a month.</p> },
                        { id: 'c', label: 'Pricing', content: <p className="sg-card-body">Fixed-scope quotes after discovery. No hourly billing surprises.</p> },
                    ]}
                />
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">9. Accordion</h2>
                <Accordion
                    items={[
                        { id: '1', title: 'Do you work with clients outside Uganda?', content: 'Yes. Most delivery is remote; we serve clients across East Africa and beyond.' },
                        { id: '2', title: 'What does an engagement cost?', content: 'Fixed-scope quotes follow a short discovery call. You approve the number before any work starts.' },
                        { id: '3', title: 'Who owns the code?', content: 'You do. Full source, documentation, and deployment access are handed over at the end.' },
                    ]}
                />
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">10. Modal + Toast</h2>
                <ToastProvider>
                    <div className="sg-row">
                        <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
                    </div>
                    <ToastDemo />
                    <Modal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title="Delete this service?"
                        actions={
                            <>
                                <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => setModalOpen(false)}>Delete</Button>
                            </>
                        }
                    >
                        This removes the service from the public site immediately. The action cannot be undone.
                    </Modal>
                </ToastProvider>
            </section>

            <section className="sg-section">
                <h2 className="sg-h2">11. Empty state + skeleton</h2>
                <div className="sg-card-grid">
                    <Card>
                        <EmptyState
                            title="No messages yet"
                            hint="New inquiries from the contact form will appear here."
                            action={<Button size="sm" variant="secondary">Refresh</Button>}
                        />
                    </Card>
                    <Card>
                        <Skeleton height={20} width="60%" style={{ marginBottom: 12 }} />
                        <Skeleton height={12} style={{ marginBottom: 8 }} />
                        <Skeleton height={12} style={{ marginBottom: 8 }} />
                        <Skeleton height={12} width="80%" />
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default StyleguidePage;

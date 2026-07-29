import React from 'react';
import PageIntro from '../components/layout/PageIntro';
import Icon from '../assets/icons/components/Icon';

const LAST_UPDATED = 'July 2026';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: 'var(--sp-10)' }}>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--ink-900)', marginBottom: 'var(--sp-3)', paddingBottom: 'var(--sp-3)', borderBottom: '1px solid var(--border-subtle)' }}>{title}</h2>
        {children}
    </div>
);

const PrivacyPage = () => (
    <main>
        <PageIntro
            kicker="Legal"
            title="Privacy policy"
            lead={`Last updated: ${LAST_UPDATED}`}
        />

        <section className="v2-section">
            <div className="v2-container" style={{ maxWidth: 800 }}>
                <div className="v2-prose">
                    <p style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)', padding: '14px 18px', fontSize: '.9rem', marginBottom: 32, borderLeft: '3px solid var(--color-secondary)' }}>
                        At Junior Reactive, your privacy is fundamental — not an afterthought. This Privacy Policy explains clearly what data we collect, why we collect it, how we use and protect it, and the rights you have over it. We do not sell your personal data. Ever.
                    </p>

                    <Section title="1. Who We Are">
                        <p>Junior Reactive Ltd is an AI and IT solutions company based in Kampala, Uganda. We operate the website juniorreactive.com and provide AI consulting, software development, automation, training, and data services to businesses.</p>
                        <p>This policy is written to comply with Uganda's <strong>Data Protection and Privacy Act, 2019</strong> and the <strong>Data Protection and Privacy Regulations, 2021</strong>. For personal information collected through our website, Junior Reactive is the data controller. For data processed in the course of delivering a client's project, we typically act as a data processor under that client's instructions.</p>
                        <p><strong>Contact:</strong> <a href="mailto:juniorreactive@gmail.com" style={{ color: 'var(--color-secondary)' }}>juniorreactive@gmail.com</a> · +256 764 524 816</p>
                    </Section>

                    <Section title="2. What Data We Collect">
                        <p><strong>Information you provide directly:</strong></p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)', marginBottom: 16 }}>
                            <li><strong>Contact form submissions</strong> — name, email address, and your message</li>
                            <li><strong>Service applications</strong> — name, email, phone number, company name, and project requirements</li>
                            <li><strong>Correspondence</strong> — emails, WhatsApp messages, and phone call notes when you contact us directly</li>
                        </ul>
                        <p><strong>Information collected automatically:</strong></p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)' }}>
                            <li>Basic server logs (IP address, browser type, pages visited, timestamps) for security and diagnostic purposes</li>
                            <li>We do <strong>not</strong> use tracking cookies, advertising cookies, or third-party analytics platforms that profile your behaviour</li>
                        </ul>
                    </Section>

                    <Section title="3. How We Use Your Data">
                        <p>We use your personal data only for the purposes for which it was collected:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                            {[
                                { purpose: 'Respond to contact form enquiries', basis: 'Legitimate interest' },
                                { purpose: 'Process and evaluate service applications', basis: 'Pre-contractual steps' },
                                { purpose: 'Deliver agreed services and projects', basis: 'Contract performance' },
                                { purpose: 'Send project-related communications', basis: 'Contract performance' },
                                { purpose: 'Issue invoices and process payments', basis: 'Legal obligation' },
                                { purpose: 'Maintain records for legal/tax compliance', basis: 'Legal obligation' },
                            ].map(row => (
                                <div key={row.purpose} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', border: '1px solid var(--color-border)' }}>
                                    <p style={{ margin: 0, fontSize: '.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 2 }}>{row.purpose}</p>
                                    <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--color-text-light)' }}>Basis: {row.basis}</p>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: 16 }}>We will not use your contact details for unsolicited marketing without your explicit consent. If you have enquired about a specific service, we may follow up once — after which we will not contact you again unless you respond.</p>
                    </Section>

                    <Section title="4. Data Sharing">
                        <p>We do not sell, rent, or trade your personal data. We share it only in the following limited circumstances:</p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)' }}>
                            <li><strong>Service delivery:</strong> Where we engage contractors or specialist partners to assist with your project, we share only the minimum data necessary and require them to maintain confidentiality.</li>
                            <li><strong>Legal obligations:</strong> We may disclose data if required to do so by Ugandan law, court order, or legitimate governmental authority.</li>
                            <li><strong>Business transfers:</strong> If Junior Reactive is acquired or merges with another entity, your data may be transferred as part of that transaction. We will notify you beforehand.</li>
                        </ul>
                        <p>Our email notifications are sent via Gmail SMTP. Your submission data passes through Google's servers in transit but is not retained or used by Google for advertising purposes under our configuration.</p>
                    </Section>

                    <Section title="5. Data Security">
                        <p>We take data security seriously and implement the following measures:</p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)' }}>
                            <li>All data transmitted through our website is encrypted via HTTPS/TLS</li>
                            <li>Form submission data is stored in a password-protected PostgreSQL database with restricted access</li>
                            <li>Database credentials are stored in environment variables, never in source code</li>
                            <li>Access to production systems is limited to authorised team members only</li>
                            <li>We conduct regular security reviews of our codebase and infrastructure</li>
                        </ul>
                        <p>No system is completely immune to security threats. In the event of a data breach that affects your rights or freedoms, we will notify you and relevant authorities as required by law.</p>
                    </Section>

                    <Section title="6. Data Retention">
                        <p>We retain your personal data only as long as necessary:</p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)' }}>
                            <li><strong>Contact enquiries</strong> — up to 12 months from last contact, unless an engagement commences</li>
                            <li><strong>Service application records</strong> — 3 years from the date of application</li>
                            <li><strong>Client project records</strong> — 7 years for financial and contractual records (required by law)</li>
                            <li><strong>Server logs</strong> — 90 days, then automatically deleted</li>
                        </ul>
                        <p>Data is securely deleted or anonymised when retention periods expire.</p>
                    </Section>

                    <Section title="7. Your Rights">
                        <p>You have the following rights regarding your personal data held by Junior Reactive:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                            {[
                                { right: 'Right of Access', desc: 'Request a copy of the personal data we hold about you.' },
                                { right: 'Right to Rectification', desc: 'Request correction of inaccurate or incomplete data.' },
                                { right: 'Right to Erasure', desc: 'Request deletion of your data where we have no legitimate ongoing need to retain it.' },
                                { right: 'Right to Restriction', desc: 'Request that we limit how we use your data while a dispute is resolved.' },
                                { right: 'Right to Portability', desc: 'Request your data in a structured, machine-readable format.' },
                                { right: 'Right to Object', desc: 'Object to processing based on legitimate interest, including direct marketing.' },
                            ].map(r => (
                                <div key={r.right} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><Icon name="success" size="sm" color="success" ariaLabel="" /></span>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: '.9rem' }}>{r.right}</p>
                                        <p style={{ margin: 0, fontSize: '.85rem' }}>{r.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: 16 }}>To exercise any of these rights, please email <a href="mailto:juniorreactive@gmail.com" style={{ color: 'var(--color-secondary)' }}>juniorreactive@gmail.com</a>. We will respond within 30 days, as required under the Data Protection and Privacy Act, 2019. We will ask you to verify your identity before processing your request.</p>
                    </Section>

                    <Section title="8. Cookies">
                        <p>Our website uses only technically necessary session cookies required for the website to function. We do not use advertising, tracking, or analytics cookies from third parties.</p>
                        <p>We do not require a cookie consent banner because we only use strictly necessary cookies, which do not require consent under applicable law.</p>
                    </Section>

                    <Section title="9. Third-Party Links">
                        <p>Our website may contain links to third-party websites (such as social media platforms). We are not responsible for the privacy practices of those sites. We encourage you to read the privacy policies of any site you visit.</p>
                    </Section>

                    <Section title="10. Children's Privacy">
                        <p>Our website and services are not directed at children under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a minor, please contact us immediately and we will delete it.</p>
                    </Section>

                    <Section title="11. Changes to This Policy">
                        <p>We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. We will update the "Last updated" date at the top of this page and, for material changes, notify existing contacts by email where we have their address.</p>
                    </Section>

                    <Section title="12. Contact Us">
                        <p>For any privacy-related questions, requests, or complaints:</p>
                        <p style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)', padding: '14px 18px', fontSize: '.9rem' }}>
                            <strong>Junior Reactive Ltd — Data Enquiries</strong><br />
                            Email: <a href="mailto:juniorreactive@gmail.com" style={{ color: 'var(--color-secondary)' }}>juniorreactive@gmail.com</a><br />
                            Phone: <a href="tel:+256764524816" style={{ color: 'var(--color-secondary)' }}>+256 764 524 816</a><br />
                            Kampala, Uganda
                        </p>
                        <p>If you are not satisfied with our response, you have the right to lodge a complaint with the <strong>Personal Data Protection Office</strong> (PDPO), the national data protection authority operating under the National Information Technology Authority — Uganda (NITA-U).</p>
                    </Section>
                </div>
            </div>
        </section>
    </main>
);

export default PrivacyPage;

import React from 'react';
import PageIntro from '../components/layout/PageIntro';
import Seo from '../components/Seo';

const LAST_UPDATED = 'July 2026';

const Section = ({ title, children }) => (
    <div style={{ marginBottom: 'var(--sp-10)' }}>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--ink-900)', marginBottom: 'var(--sp-3)', paddingBottom: 'var(--sp-3)', borderBottom: '1px solid var(--border-subtle)' }}>{title}</h2>
        {children}
    </div>
);

const TermsPage = () => (
    <main>
        <Seo
            title="Terms of Service"
            description="The terms governing engagements with Junior Reactive, under Uganda's Contracts Act 2010 and Electronic Transactions Act 2011."
            path="/terms"
        />
        <PageIntro
            kicker="Legal"
            title="Terms of service"
            lead={`Last updated: ${LAST_UPDATED}`}
        />

        <section className="v2-section">
            <div className="v2-container" style={{ maxWidth: 800 }}>
                <div className="v2-prose">
                    <p style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)', padding: '14px 18px', fontSize: '.9rem', marginBottom: 32, borderLeft: '3px solid var(--color-secondary)' }}>
                        Please read these Terms of Service carefully before using our website or engaging our services. By accessing our website or entering into a service agreement with Junior Reactive, you accept and agree to be bound by these terms.
                    </p>

                    <Section title="1. About Junior Reactive">
                        <p>Junior Reactive Ltd ("Junior Reactive", "we", "us", or "our") is an AI and IT solutions company headquartered in Kampala, Uganda. We provide services including AI consulting, custom software development, N8N workflow automation, data analytics, cloud solutions, predictive modeling, AI awareness training, and business intelligence dashboard design.</p>
                        <p>These Terms of Service govern your use of our website at juniorreactive.com and any services you engage us to provide.</p>
                    </Section>

                    <Section title="2. Services and Engagement">
                        <p><strong>Service Agreements:</strong> All service engagements are governed by a separate Statement of Work or Service Agreement document that sets out the specific scope, deliverables, timelines, and pricing agreed between Junior Reactive and the client. These Terms of Service apply in addition to any such agreement.</p>
                        <p><strong>Discovery Process:</strong> Our initial discovery consultations are provided free of charge. No obligation to proceed arises from attending a discovery call or receiving a proposal.</p>
                        <p><strong>Proposals:</strong> All proposals and quotations are valid for 30 days from the date of issue unless otherwise stated. Pricing may be revised after this period.</p>
                        <p><strong>Acceptance:</strong> Engagement commences only upon written acceptance of a proposal or execution of a service agreement, and receipt of any required deposit payment.</p>
                    </Section>

                    <Section title="3. Payment Terms">
                        <p><strong>Invoicing:</strong> Payment terms are specified in each service agreement. Standard terms require a deposit of 30–50% upon commencement, with the balance due upon delivery or at agreed milestone points.</p>
                        <p><strong>Late Payment:</strong> Invoices not settled within 14 days of the due date may attract a late payment charge of 2% per month on the outstanding balance. We reserve the right to suspend services on accounts with overdue balances.</p>
                        <p><strong>Taxes:</strong> Prices quoted exclude applicable taxes (including VAT where applicable in Uganda) unless explicitly stated otherwise. The client is responsible for any applicable withholding taxes and must provide the necessary documentation.</p>
                        <p><strong>Refunds:</strong> Deposits are non-refundable unless Junior Reactive is unable to commence or complete the agreed services for reasons within our control. Work completed to the date of termination will be invoiced at a pro-rated rate.</p>
                    </Section>

                    <Section title="4. Intellectual Property">
                        <p><strong>Client IP:</strong> All intellectual property, data, content, and materials you provide to us remain your property at all times. We will not use client materials for any purpose other than delivering the agreed services.</p>
                        <p><strong>Deliverable IP:</strong> Upon receipt of full payment, Junior Reactive assigns to the client all rights in bespoke deliverables created specifically for that client, including custom software, automation workflows, and reports.</p>
                        <p><strong>Junior Reactive IP:</strong> We retain ownership of our pre-existing methodologies, frameworks, tools, templates, and general know-how. Where our proprietary tools or frameworks are incorporated into a deliverable, we grant the client a perpetual, non-exclusive licence to use them for their intended purpose.</p>
                        <p><strong>Third-Party Tools:</strong> Some deliverables may incorporate third-party software, APIs, or platforms (such as N8N, Power BI, or cloud services). Use of these tools is subject to the respective third-party's terms of service. Junior Reactive accepts no responsibility for changes to third-party tools that affect functionality of delivered solutions.</p>
                    </Section>

                    <Section title="5. Confidentiality">
                        <p>Both parties agree to maintain the confidentiality of proprietary and sensitive information disclosed during the engagement. Junior Reactive will not disclose client business information, data, strategies, or technical details to third parties without express written consent, except where required by law.</p>
                        <p>This confidentiality obligation survives the termination of any engagement for a period of three (3) years.</p>
                        <p>We may request that clients sign a separate Non-Disclosure Agreement (NDA) for particularly sensitive engagements.</p>
                    </Section>

                    <Section title="6. Data and Privacy">
                        <p>Our collection and use of personal data in connection with our website and services is governed by our <a href="/privacy" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Privacy Policy</a>, which forms part of these Terms of Service and is drafted to comply with Uganda's Data Protection and Privacy Act, 2019.</p>
                        <p>In engagements involving client data, we act as a data processor. We implement appropriate technical and organisational measures to protect personal data and will not process client data except as instructed by the client or required by applicable law.</p>
                    </Section>

                    <Section title="7. Warranties and Representations">
                        <p><strong>Our Warranties:</strong> Junior Reactive warrants that our services will be performed with reasonable skill and care, in accordance with the agreed specification, and by appropriately qualified personnel.</p>
                        <p><strong>Warranty Period:</strong> We provide a 30-day warranty on delivered software and automation solutions. During this period, we will rectify defects at no additional charge. Issues arising from client modifications, third-party changes, or use outside the agreed specification are not covered.</p>
                        <p><strong>No Guarantee of Results:</strong> While we apply best practices and proven methodologies, we cannot guarantee specific business outcomes (such as revenue increases or cost savings). Client cooperation, data quality, and external market factors affect results.</p>
                        <p><strong>AI Limitations:</strong> AI and machine learning solutions involve inherent uncertainties. Predictive models provide probabilistic outputs, not certainties. We will communicate model limitations clearly in all deliverables.</p>
                    </Section>

                    <Section title="8. Limitation of Liability">
                        <p>To the maximum extent permitted by applicable law:</p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)' }}>
                            <li>Junior Reactive's total liability for any claim arising out of or related to our services shall not exceed the fees paid by the client in the three months preceding the claim.</li>
                            <li>We are not liable for indirect, consequential, incidental, or special damages, including loss of profit, loss of data, or business interruption.</li>
                            <li>We are not liable for failures caused by client-side infrastructure, third-party services, force majeure events, or client modifications to delivered systems.</li>
                        </ul>
                        <p>Nothing in these terms limits liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded under applicable law.</p>
                    </Section>

                    <Section title="9. Termination">
                        <p><strong>By Client:</strong> Clients may terminate an engagement with 14 days written notice. Work completed to the date of termination will be invoiced at the agreed rate, and any outstanding balance is immediately due.</p>
                        <p><strong>By Junior Reactive:</strong> We reserve the right to terminate or suspend services if the client breaches these terms, fails to pay invoices, or acts in a way that compromises our team's ability to deliver safely and effectively. We will provide reasonable notice except in cases of serious breach.</p>
                        <p><strong>Effect of Termination:</strong> On termination, we will provide the client with all completed work product and relevant documentation. Confidentiality obligations, IP ownership provisions, and limitation of liability clauses survive termination.</p>
                    </Section>

                    <Section title="10. Website Use">
                        <p>Our website is provided for informational purposes and to facilitate engagement with our services. You agree not to:</p>
                        <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--color-text-mid)' }}>
                            <li>Use the website for any unlawful purpose or in violation of applicable law</li>
                            <li>Attempt to gain unauthorised access to any part of our systems</li>
                            <li>Transmit harmful, offensive, or misleading content through our contact forms</li>
                            <li>Scrape, copy, or reproduce our website content without prior written consent</li>
                        </ul>
                        <p>We reserve the right to restrict access to users who violate these terms.</p>
                    </Section>

                    <Section title="11. Governing Law and Disputes">
                        <p>These Terms of Service, and any service agreement entered into under them, are governed by the laws of the Republic of Uganda, including the Contracts Act, 2010 and the Electronic Transactions Act, 2011 for agreements formed or performed electronically.</p>
                        <p>Any disputes that cannot be resolved amicably between the parties shall first be referred to mediation. If mediation fails, either party may proceed to arbitration under the Arbitration and Conciliation Act (Cap. 4), or to the courts of Uganda, which have exclusive jurisdiction over any dispute arising from these terms or our services.</p>
                    </Section>

                    <Section title="12. Changes to These Terms">
                        <p>We may update these Terms of Service from time to time. Material changes will be communicated via our website. Continued use of our website or services after such changes constitutes acceptance of the updated terms.</p>
                    </Section>

                    <Section title="13. Contact">
                        <p>For questions about these Terms of Service, please contact us at:</p>
                        <p style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)', padding: '14px 18px', fontSize: '.9rem' }}>
                            <strong>Junior Reactive Ltd</strong><br />
                            Kampala, Uganda<br />
                            Email: <a href="mailto:juniorreactive@gmail.com" style={{ color: 'var(--color-secondary)' }}>juniorreactive@gmail.com</a><br />
                            Phone: <a href="tel:+256764524816" style={{ color: 'var(--color-secondary)' }}>+256 764 524 816</a>
                        </p>
                    </Section>
                </div>
            </div>
        </section>
    </main>
);

export default TermsPage;

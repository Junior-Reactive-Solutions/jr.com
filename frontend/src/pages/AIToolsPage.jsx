import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceRecommender from '../components/ServiceRecommender';
import ProjectBriefGenerator from '../components/ProjectBriefGenerator';
import Icon from '../assets/icons/components/Icon';

const TABS = [
  {
    id: 'recommender',
    icon: 'target',
    label: 'Find My Service',
    headline: 'AI Service Recommender',
    sub: '5 questions · Instant result · No signup needed',
    desc: 'Answer a few questions and our AI will match you to the exact Junior Reactive service that fits your situation, budget, and goals.',
  },
  {
    id: 'brief',
    icon: 'document',
    label: 'Generate Brief',
    headline: 'AI Project Brief Generator',
    sub: 'Powered by Llama 3 · Takes ~2 minutes',
    desc: "Describe your business challenge and we'll generate a full, professional project brief — scope, timeline, budget estimate, recommended approach — in under 30 seconds.",
  },
];

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('recommender');
  const activeData = TABS.find(t => t.id === activeTab);

  return (
    <main>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero" style={{ padding: '80px 0 60px' }}>
        <div className="container">
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="bot" size="sm" color="white" /> Live AI Demos</div>
          <h1>AI That Works — <span style={{ color: 'rgba(255,255,255,0.7)' }}>Right Here</span></h1>
          <p className="hero-sub" style={{ maxWidth: 600, margin: '0 auto' }}>
            These tools aren't just demos — they're real examples of what Junior Reactive 
            builds for clients. Every AI feature on this page is production-ready and 
            deployable in your own product.
          </p>
          <div className="ai-hero-stats">
            <div className="ai-stat">
              <strong>Free</strong>
              <span>No API costs to use</span>
            </div>
            <div className="ai-stat">
              <strong>Llama 3</strong>
              <span>Meta's open-source AI</span>
            </div>
            <div className="ai-stat">
              <strong>Instant</strong>
              <span>Real-time responses</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab selector ──────────────────────────────────────────────── */}
      <section className="section ai-tools-section">
        <div className="container">

          <div className="ai-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`ai-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Icon name={tab.icon} size="sm" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tool panel */}
          <div className="ai-tool-panel">

            {/* Left: description */}
            <div className="ai-tool-info">
              <h2>{activeData.headline}</h2>
              <p className="ai-tool-sub">{activeData.sub}</p>
              <p className="ai-tool-desc">{activeData.desc}</p>

              <div className="ai-tool-features">
                {activeTab === 'recommender' && (
                  <>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> 5 targeted questions</div>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Personalised service match</div>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Direct link to apply</div>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Works offline — no API calls</div>
                  </>
                )}
                {activeTab === 'brief' && (
                  <>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Full brief in ~15 seconds</div>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Scope, timeline & budget estimate</div>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Print or copy as PDF</div>
                    <div className="ai-feature-item"><Icon name="check" size="xs" color="success" /> Powered by Llama 3.3 70B</div>
                  </>
                )}
              </div>

              <div className="ai-tool-callout">
                <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="idea" size="sm" color="primary" /> <strong>Want this on your website?</strong></p>
                <p>We build custom AI tools — chatbots, recommenders, brief generators, lead qualifiers — tailored to your industry and brand.</p>
                <Link to="/apply" className="btn btn-outline" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Build Something Like This <Icon name="arrow-right" size="xs" />
                </Link>
              </div>
            </div>

            {/* Right: interactive tool */}
            <div className="ai-tool-widget">
              {activeTab === 'recommender' && <ServiceRecommender />}
              {activeTab === 'brief' && <ProjectBriefGenerator />}
            </div>

          </div>
        </div>
      </section>

      {/* ── What we build ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header">
            <h2>What We Can Build For You</h2>
            <p>Every AI integration above is a template for what's possible in your product or workflow.</p>
          </div>
          <div className="ai-examples-grid">
            {[
              { icon: 'bot',        title: 'Custom Chatbots', desc: 'Trained on your data, integrated with your CRM, live on your website 24/7.' },
              { icon: 'target',     title: 'Smart Recommenders', desc: 'Product recommenders, service matchers, lead qualifiers — pure logic or AI.' },
              { icon: 'document',   title: 'Document Generators', desc: 'Proposals, briefs, contracts, reports — generated from a form in seconds.' },
              { icon: 'analytics',  title: 'AI Analytics Dashboards', desc: 'Dashboards that explain data in plain English, not just charts.' },
              { icon: 'automation', title: 'AI-Powered Workflows', desc: 'N8N + AI: automated decisions, classification, summarisation at scale.' },
              { icon: 'search',     title: 'Smart Search & Q&A', desc: 'Let users ask questions about your products, docs, or knowledge base.' },
            ].map(item => (
              <div className="ai-example-card" key={item.title}>
                <span className="ai-example-icon"><Icon name={item.icon} size="lg" color="primary" ariaLabel={`${item.title} icon`} /></span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/apply" className="btn" style={{ marginRight: 12, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Start a Project <Icon name="arrow-right" size="xs" color="white" />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

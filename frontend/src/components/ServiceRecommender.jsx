import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../assets/icons/components/Icon';
import { useReveal } from '../hooks/useAnime';

// ── Quiz Questions ────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'challenge',
    question: "What's your biggest business challenge right now?",
    options: [
      { label: 'Too much manual/repetitive work', value: 'automation', icon: 'automation' },
      { label: 'Lack of data insights & reporting', value: 'data', icon: 'analytics' },
      { label: 'Want to build a digital product', value: 'software', icon: 'dev' },
      { label: 'Need to understand & adopt AI', value: 'training', icon: 'ai' },
    ],
  },
  {
    id: 'size',
    question: 'How large is your team or business?',
    options: [
      { label: 'Just me / freelancer', value: 'solo', icon: 'user' },
      { label: 'Small team (2–15 people)', value: 'small', icon: 'team' },
      { label: 'Medium business (16–100)', value: 'medium', icon: 'company' },
      { label: 'Large organisation (100+)', value: 'large', icon: 'building' },
    ],
  },
  {
    id: 'urgency',
    question: 'How soon do you need a solution?',
    options: [
      { label: 'As soon as possible (< 1 month)', value: 'urgent', icon: 'fire' },
      { label: 'Within 3 months', value: 'near', icon: 'calendar' },
      { label: 'Within 6 months', value: 'medium', icon: 'calendar' },
      { label: 'Just exploring for now', value: 'exploring', icon: 'telescope' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your approximate budget?',
    options: [
      { label: 'Under UGX 1,000,000', value: 'micro', icon: 'money' },
      { label: 'UGX 1M – 5M', value: 'small', icon: 'money' },
      { label: 'UGX 5M – 20M', value: 'medium', icon: 'gem' },
      { label: 'UGX 20M+', value: 'large', icon: 'award' },
    ],
  },
  {
    id: 'tech',
    question: "How technical is your team?",
    options: [
      { label: 'No technical background', value: 'none', icon: 'document' },
      { label: 'Basic — use spreadsheets & email', value: 'basic', icon: 'notes' },
      { label: 'Moderate — some tools/software', value: 'moderate', icon: 'settings' },
      { label: 'Technical / have developers', value: 'high', icon: 'zap' },
    ],
  },
];

// ── Recommendation Engine ─────────────────────────────────────────────────────
function getRecommendation(answers) {
  const { challenge, size, urgency, budget, tech } = answers;

  // Primary recommendation based on challenge + budget + tech
  if (challenge === 'training') {
    return {
      primary: budget === 'micro' || budget === 'small'
        ? 'AI Awareness Session'
        : 'AI Courses & Training Programme',
      secondary: 'AI Consulting (Strategy Roadmap)',
      why: "Your team needs to build AI literacy before implementing tools. A structured training programme will give everyone the foundation to evaluate and use AI confidently.",
      outcome: "A team that can identify AI opportunities, evaluate tools, and champion adoption internally.",
      applyService: 'AI+Awareness+Sessions',
      urgencyNote: urgency === 'urgent' ? 'We can schedule a session within 2 weeks.' : 'We run cohorts monthly — easy to fit your calendar.',
      icon: 'training',
      color: '#1c265e',
    };
  }

  if (challenge === 'automation') {
    if (budget === 'micro') {
      return {
        primary: 'N8N Workflow Automation (Starter)',
        secondary: 'Free Discovery Call',
        why: "We can automate 2-3 of your most painful manual processes with N8N at a budget-friendly entry point. Perfect for solo operators and small teams.",
        outcome: "Save 5-15 hours per week by automating repetitive tasks — email, forms, data syncing, reports.",
        applyService: 'N8N+Workflow+Automation',
        urgencyNote: 'Simple automations can go live in 1-2 weeks.',
        icon: 'zap',
        color: '#1c265e',
      };
    }
    return {
      primary: 'N8N Workflow Automation',
      secondary: size === 'large' ? 'Enterprise Integration Package' : 'Business Intelligence Dashboard',
      why: "N8N is the ideal tool to connect your existing software, eliminate manual data entry, and create reliable automated workflows — without changing your entire tech stack.",
      outcome: "End-to-end automated workflows that run 24/7, reducing errors and freeing your team for high-value work.",
      applyService: 'N8N+Workflow+Automation',
      urgencyNote: urgency === 'urgent' ? 'We can deliver a first automation in under 3 weeks.' : 'Full automation suite typically delivered in 4-8 weeks.',
      icon: 'automation',
      color: '#1c265e',
    };
  }

  if (challenge === 'data') {
    if (tech === 'none' || tech === 'basic') {
      return {
        primary: 'Business Intelligence Dashboard',
        secondary: 'Data Analytics & Insights',
        why: "A well-designed Power BI dashboard will give you clear, visual answers to your business questions without needing to understand the data yourself. Real-time, shareable, and built for non-technical users.",
        outcome: "Replace scattered spreadsheets with one live dashboard your whole leadership team can use daily.",
        applyService: 'BI+Dashboards',
        urgencyNote: 'First dashboard prototype delivered within 2-3 weeks.',
        icon: 'analytics',
        color: '#1c265e',
      };
    }
    return {
      primary: 'Predictive Modeling & Machine Learning',
      secondary: 'Data Analytics & Business Intelligence',
      why: "With a technical foundation in place, you're ready for predictive analytics — forecasting demand, predicting churn, or identifying hidden patterns in your data.",
      outcome: "Data-driven decisions backed by statistical models, not guesswork. Measurable ROI from reduced churn or optimised operations.",
      applyService: 'Predictive+Modeling',
      urgencyNote: 'Initial model and insights delivered within 4-6 weeks.',
      icon: 'predictive',
      color: '#1c265e',
    };
  }

  if (challenge === 'software') {
    if (urgency === 'urgent' && budget !== 'large') {
      return {
        primary: 'Free Discovery Call + Scoping Session',
        secondary: 'Custom Software Development (MVP)',
        why: "For urgent software needs, the fastest path is a free discovery call to define an MVP scope. Trying to build too fast without clear requirements leads to expensive rewrites.",
        outcome: "A clearly scoped MVP that can be delivered in 6-10 weeks, with full product roadmap for subsequent phases.",
        applyService: 'Custom+Software+Development',
        urgencyNote: 'Discovery call can be scheduled this week. MVP build starts immediately after.',
        icon: 'dev',
        color: '#1c265e',
      };
    }
    return {
      primary: 'Custom Software Development',
      secondary: 'AI Consulting (AI Features Integration)',
      why: "Junior Reactive builds end-to-end digital products — web apps, mobile apps, and APIs — with modern tech and AI features built in from the start rather than bolted on later.",
      outcome: "A production-ready application tailored to your users, with clear documentation and ongoing support options.",
      applyService: 'Custom+Software+Development',
      urgencyNote: 'Full project timeline scoped during free discovery call.',
      icon: 'rocket',
      color: '#1c265e',
    };
  }

  // Default / AI Consulting
  return {
    primary: 'AI Consulting & Strategy Roadmap',
    secondary: 'Free Discovery Call',
    why: "A strategy-first approach saves significant time and money. Our AI consulting engagement identifies your highest-value opportunities, creates a phased roadmap, and ensures every investment is justified.",
    outcome: "A clear, prioritised AI roadmap with vendor recommendations, budget estimates, and a phased implementation plan.",
    applyService: 'AI+Consulting',
    urgencyNote: 'Initial free consultation can be scheduled within 48 hours.',
    icon: 'ai',
    color: '#1c265e',
  };
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div className="sr-progress">
      <div className="sr-progress-bar">
        <div
          className="sr-progress-fill"
          style={{ width: `${((current) / total) * 100}%` }}
        />
      </div>
      <span className="sr-progress-label">Question {current} of {total}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ServiceRecommender() {
  const [step, setStep]           = useState(0); // 0 = intro, 1-5 = questions, 6 = result
  const [answers, setAnswers]     = useState({});
  const [selected, setSelected]   = useState(null);
  const [animating, setAnimating] = useState(false);
  const optionsRef = useReveal({ stagger: 60, y: 12, delay: 100 });

  const currentQ = QUESTIONS[step - 1];
  const isResult = step > QUESTIONS.length;
  const recommendation = isResult ? getRecommendation(answers) : null;

  const handleSelect = (value) => setSelected(value);

  const handleNext = () => {
    if (!selected && step > 0) return;
    if (animating) return;

    setAnimating(true);
    setTimeout(() => {
      if (step > 0) {
        setAnswers(prev => ({ ...prev, [currentQ.id]: selected }));
      }
      setSelected(null);
      setStep(s => s + 1);
      setAnimating(false);
    }, 200);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
  };

  // ── Intro ────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="sr-card">
        <div className="sr-intro">
          <div className="sr-intro-icon"><Icon name="target" size="xl" color="primary" ariaLabel="Service finder" /></div>
          <h3>Find Your Perfect Service</h3>
          <p>Answer 5 quick questions and we'll recommend the exact Junior Reactive service that fits your situation — no sales pressure, just honest guidance.</p>
          <div className="sr-intro-meta">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="time" size="xs" /> Takes about 1 minute</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="check" size="xs" color="success" /> 100% free & no signup needed</span>
          </div>
          <button className="btn sr-start-btn" onClick={handleNext} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start the Quiz <Icon name="arrow-right" size="xs" color="white" />
          </button>
        </div>
      </div>
    );
  }

  // ── Result ───────────────────────────────────────────────────────────────
  if (isResult && recommendation) {
    return (
      <div className="sr-card sr-result-card">
        <div className="sr-result-header" style={{ '--rec-color': recommendation.color }}>
          <div className="sr-result-icon"><Icon name={recommendation.icon} size="xl" color={recommendation.color} ariaLabel="Recommended service" /></div>
          <div className="sr-result-badge">Our Recommendation</div>
          <h3 className="sr-result-title">{recommendation.primary}</h3>
          {recommendation.secondary && (
            <p className="sr-result-secondary">Also consider: <strong>{recommendation.secondary}</strong></p>
          )}
        </div>

        <div className="sr-result-body">
          <div className="sr-result-section">
            <h4>Why this fits you</h4>
            <p>{recommendation.why}</p>
          </div>

          <div className="sr-result-section">
            <h4>Expected Outcome</h4>
            <p>{recommendation.outcome}</p>
          </div>

          <div className="sr-result-timing">
            <Icon name="time" size="sm" color="primary" ariaLabel="Timing" />
            <span>{recommendation.urgencyNote}</span>
          </div>

          <div className="sr-result-actions">
            <Link
              to={`/apply?service=${recommendation.applyService}`}
              className="btn sr-apply-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Apply for This Service <Icon name="arrow-right" size="xs" color="white" />
            </Link>
            <Link to="/contact" className="btn btn-outline sr-contact-btn">
              Ask a Question First
            </Link>
          </div>

          <button className="sr-restart-btn" onClick={handleReset}>
            Retake the Quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Question ─────────────────────────────────────────────────────────────
  return (
    <div className={`sr-card ${animating ? 'sr-animating' : ''}`}>
      <ProgressBar current={step} total={QUESTIONS.length} />

      <div className="sr-question">
        <h3>{currentQ.question}</h3>
      </div>

      <div className="sr-options" ref={optionsRef}>
        {currentQ.options.map(opt => (
          <button
            key={opt.value}
            className={`sr-option ${selected === opt.value ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            <span className="sr-option-icon"><Icon name={opt.icon} size="sm" color="primary" ariaLabel="" /></span>
            <span className="sr-option-label">{opt.label}</span>
            {selected === opt.value && <span className="sr-option-check"><Icon name="check" size="xs" color="success" /></span>}
          </button>
        ))}
      </div>

      <div className="sr-nav">
        {step > 1 && (
          <button
            className="sr-back-btn"
            onClick={() => { setStep(s => s - 1); setSelected(answers[QUESTIONS[step - 2]?.id] || null); }}
          >
            Back
          </button>
        )}
        <button
          className={`btn sr-next-btn ${!selected ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!selected}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          {step === QUESTIONS.length ? 'See My Recommendation' : 'Next'} <Icon name="arrow-right" size="xs" color="white" />
        </button>
      </div>
    </div>
  );
}

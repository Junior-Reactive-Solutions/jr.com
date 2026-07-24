const express = require('express');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.GROQ_API_KEY;

// Defense-in-depth: the system prompt instructs the model not to use emoji,
// but instructions alone are not reliable — strip any that slip through
// before a response ever reaches the client (project-wide no-emoji rule).
const EMOJI_PATTERN = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;
function stripEmoji(text) {
    return typeof text === 'string' ? text.replace(EMOJI_PATTERN, '').replace(/[ \t]{2,}/g, ' ').trim() : text;
}

// ── Rate limiting for AI endpoints ────────────────────────────────────────────
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 60,                     // 60 AI requests per window per IP
    message: { success: false, error: 'Too many AI requests. Please wait a moment.' },
});

// ── Shared Groq call helper ───────────────────────────────────────────────────
async function callGroq(model, messages, temperature = 0.7, max_tokens = 600) {
    if (!GROQ_KEY) throw new Error('GROQ_API_KEY not configured on server.');

    const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
}

// ══════════════════════════════════════════════════════════════════════════════
//   POST /api/ai/chat  — Chatbot powered by Llama 3
// ══════════════════════════════════════════════════════════════════════════════

// TODO: services, team and pricing below are hardcoded and can drift from the
// database-backed content. Consider sourcing these from the DB in a future pass.
const JR_SYSTEM_PROMPT = `You are JR Assistant, the official AI chatbot for Junior Reactive — an AI & IT solutions company based in Kampala, Uganda.

## COMPANY INFO
- Full name: Junior Reactive
- Tagline: "AI That Works For You"
- Location: Kampala, Uganda
- Email: juniorreactive@gmail.com
- Phone/WhatsApp: +256 764 524 816
- Response time: Within 24 hours
- Founder & CEO: Pharrell Aaron Mugumya

## SERVICES (9 core services)
1. AI Consulting — Strategy, audits, roadmaps, vendor selection. Free initial consultation.
2. Custom Software Development — Web apps, mobile apps, APIs, full-stack.
3. N8N Workflow Automation — Connect apps, automate repetitive tasks, self-hosted, 24/7 workflows.
4. Data Analytics & Business Intelligence — Power BI dashboards, data pipelines, insights.
5. Predictive Modeling & Machine Learning — Churn prediction, demand forecasting, ML models.
6. Cloud Solutions — AWS, Azure, GCP, migrations, Docker, Kubernetes, cost optimisation.
7. AI Awareness Sessions — Half-day/full-day workshops for non-technical teams. Certificate included.
8. AI Courses & Training — ML fundamentals, Prompt Engineering, Power BI, N8N. Certificate included.
9. Business Intelligence Dashboards — Interactive live dashboards replacing spreadsheets.

## PRICING GUIDE
- AI Awareness Session: from UGX 800,000
- N8N Automation Build: from UGX 2,000,000
- BI Dashboard: from UGX 3,500,000
- Custom Software: scoped after free discovery call
- Initial discovery call: always FREE
- All quotes are custom — project scope determines price.

## TEAM
- Pharrell Aaron Mugumya — Founder & CEO
- David Ochieng — Head of Engineering
- Amara Nkosi — Lead Data Scientist
- Brian Ssekandi — Cloud & DevOps
- Grace Auma — AI Trainer
- Kevin Mutiso — N8N Automation Specialist

## PORTFOLIO HIGHLIGHTS
- Logistics dispatch automation (saves 90 mins/day)
- Retail BI dashboard (replaced 12 spreadsheets)
- Churn prediction model (23% churn reduction)
- Agricultural market price platform
- HR onboarding automation
- Corporate AI Awareness Programme (rated 5/5)

## PAGES ON WEBSITE
- Home: /
- Services: /services
- About: /about
- Team: /team
- Portfolio: /portfolio
- Blog: /blog
- FAQ: /faq
- Contact: /contact
- Apply / Get Started: /apply
- AI Tools (demos): /ai-tools

## HOW TO APPLY / GET STARTED
1. Visit /apply and fill the Service Application form
2. JR reviews within 24 hours
3. Free discovery call scheduled
4. Detailed proposal sent
5. Work begins — no commitment until happy with proposal

## YOUR BEHAVIOUR RULES
- Never use emoji, emoticons, or decorative symbols anywhere in a response, including in suggestions. Plain text only.
- Be warm, professional, and concise. Max 3-4 sentences per response unless asked for detail.
- ALWAYS end responses with 1-3 actionable suggestions as a JSON block like this:
  {"suggestions": ["Book a free discovery call", "See our services", "View portfolio"]}
- If the user wants to navigate somewhere, include a navigate action:
  {"suggestions": [...], "navigate": "/services"}
- For WhatsApp: link is https://wa.me/256764524816
- Never make up information. If unsure, direct them to contact the team.
- When the user mentions budget, timeline, or a specific problem, offer to generate a Project Brief.
- Keep responses friendly and specific to East African business context where relevant.
- Format responses with line breaks for readability. Use bullet points sparingly.`;

router.post('/chat', aiLimiter, async (req, res) => {
    try {
        const { messages, userMessage } = req.body;

        if (!userMessage || typeof userMessage !== 'string') {
            return res.status(400).json({ success: false, error: 'userMessage is required.' });
        }
        // Cap input size to limit token cost and prompt-injection surface.
        if (userMessage.length > 2000) {
            return res.status(400).json({ success: false, error: 'Message is too long (max 2000 characters).' });
        }

        // Build message history (last 8 turns max to stay within limits),
        // dropping any oversized entries and clamping content length.
        const history = (Array.isArray(messages) ? messages : [])
            .filter(m => m && typeof m.content === 'string' && m.content.length <= 2000)
            .slice(-8);
        const groqMessages = [
            { role: 'system', content: JR_SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: userMessage },
        ];

        const raw = await callGroq('llama-3.1-8b-instant', groqMessages, 0.7, 500);

        // Parse suggestions & navigate action from response
        let cleanText = raw;
        let suggestions = [];
        let navigate = null;

        const jsonMatch = raw.match(/\{[\s\S]*"suggestions"[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                suggestions = parsed.suggestions || [];
                navigate = parsed.navigate || null;
                cleanText = raw.replace(jsonMatch[0], '').trim();
            } catch (_) { /* keep raw if parse fails */ }
        }

        // Default suggestions if none parsed
        if (suggestions.length === 0) {
            suggestions = ['Tell me about your services', 'How do I get started?', 'View pricing'];
        }

        res.json({
            success: true,
            message: stripEmoji(cleanText),
            suggestions: suggestions.map(stripEmoji),
            navigate,
        });

    } catch (err) {
        logger.error({ err }, 'AI Chat error');
        res.status(500).json({
            success: false,
            error: 'AI service temporarily unavailable. Please contact us directly.',
            message: "The assistant is unavailable right now. You can reach the team directly at juniorreactive@gmail.com or WhatsApp +256 764 524 816.",
            suggestions: ['Contact Us', 'WhatsApp Us'],
        });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   POST /api/ai/brief  — AI Project Brief Generator (Llama 3.3 70B)
// ══════════════════════════════════════════════════════════════════════════════
router.post('/brief', aiLimiter, async (req, res) => {
    try {
        const { companyName, industry, problem, budget, timeline, techLevel, contactEmail } = req.body;

        // Basic validation
        if (!companyName || !industry || !problem) {
            return res.status(400).json({
                success: false,
                error: 'companyName, industry, and problem are required.',
            });
        }
        // Cap each field to limit token cost and prompt-injection surface.
        const overLimit = [
            ['companyName', companyName, 200],
            ['industry', industry, 200],
            ['problem', problem, 2000],
            ['budget', budget, 200],
            ['timeline', timeline, 200],
            ['techLevel', techLevel, 200],
        ].find(([, value, max]) => typeof value === 'string' && value.length > max);
        if (overLimit) {
            return res.status(400).json({ success: false, error: `${overLimit[0]} is too long (max ${overLimit[2]} characters).` });
        }

        const prompt = `Generate a professional project brief for a potential client of Junior Reactive (an AI & IT company in Kampala, Uganda).

CLIENT DETAILS:
- Company: ${companyName}
- Industry: ${industry}
- Problem/Need: ${problem}
- Budget Range: ${budget || 'Not specified'}
- Timeline: ${timeline || 'Flexible'}
- Technical Level: ${techLevel || 'Non-technical'}

Write a structured project brief in this exact format. Be specific, actionable, and realistic:

## Executive Summary
[2-3 sentences summarising the client situation and recommended approach]

## Problem Analysis
[Bullet points identifying 3-4 core challenges based on their description]

## Recommended Services
[List 2-3 specific Junior Reactive services that match their needs, with a one-line reason for each]

## Proposed Solution Approach
[3-4 bullet points describing the implementation approach step by step]

## Estimated Timeline
[Phase breakdown with realistic timeframes based on their stated timeline]

## Investment Estimate
[Rough range in UGX based on the services recommended and their budget. Be honest if budget seems too low.]

## Expected Outcomes
[3-4 measurable outcomes they can expect from this engagement]

## Next Steps
[Clear 3-step action plan to move forward with Junior Reactive]

Keep it professional, specific to their industry, and grounded in realistic East African business context. Do not use filler phrases.`;

        const brief = await callGroq('llama-3.3-70b-versatile', [
            { role: 'user', content: prompt }
        ], 0.6, 1200);

        res.json({
            success: true,
            brief: stripEmoji(brief),
            meta: { companyName, industry, generatedAt: new Date().toISOString() },
        });

    } catch (err) {
        logger.error({ err }, 'AI Brief error');
        res.status(500).json({
            success: false,
            error: 'Brief generation failed. Please try again or contact us directly.',
        });
    }
});

module.exports = router;

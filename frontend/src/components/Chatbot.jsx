import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../assets/icons/components/Icon';
import './Chatbot.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5005';

// ── Format **bold** and line breaks ─────────────────────────────────────────
function renderLines(text) {
  if (!text) return null;
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={j}>{p.slice(2, -2)}</strong>
        : p
    );
    return <span key={i}>{parts}{i < arr.length - 1 && <br />}</span>;
  });
}

// ── Suggestion routing map ───────────────────────────────────────────────────
const ROUTE_MAP = {
  'our services': '/services',
  'see our services': '/services',
  'view services': '/services',
  'services': '/services',
  'meet the team': '/team',
  'team': '/team',
  'portfolio': '/portfolio',
  'view portfolio': '/portfolio',
  'apply': '/apply',
  'apply now': '/apply',
  'get started': '/apply',
  'book a free discovery call': '/apply',
  'contact us': '/contact',
  'contact': '/contact',
  'about': '/about',
  'faq': '/faq',
  'blog': '/blog',
  'ai tools': '/ai-tools',
  'ai demos': '/ai-tools',
  'generate a project brief': '/ai-tools',
  'whatsapp us': 'https://wa.me/256764524816',
};

function resolveRoute(suggestion) {
  const key = suggestion.toLowerCase().trim();
  return ROUTE_MAP[key] || null;
}

// ── Initial greeting ─────────────────────────────────────────────────────────
const INITIAL_MESSAGE = {
  id: 1,
  from: 'bot',
  text: "Hi there! I'm **JR Assistant**, powered by AI.\n\nI can answer questions about our services, help you find the right solution, or navigate you anywhere on the site. What would you like to know?",
  suggestions: ['What services do you offer?', 'How much does it cost?', 'Book a free discovery call'],
};

export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [unread, setUnread]     = useState(0);
  const [history, setHistory]   = useState([]); // For Groq context
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);
  const navigate                = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ── Send message to backend ──────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setInput('');

    // Add user message
    const userMsg = { id: Date.now(), from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build history for context
    const updatedHistory = [
      ...history,
      { role: 'user', content: trimmed },
    ];

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: trimmed,
          messages: history,
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        from: 'bot',
        text: data.message || "I couldn't process that. Please try again.",
        suggestions: data.suggestions || [],
        navigate: data.navigate || null,
      };

      setMessages(prev => [...prev, botMsg]);
      setHistory([
        ...updatedHistory,
        { role: 'assistant', content: data.message || '' },
      ]);

      if (!open) setUnread(n => n + 1);

      // Auto-navigate if the AI suggests it (after a short delay)
      if (data.navigate) {
        setTimeout(() => {
          navigate(data.navigate);
          setOpen(false);
        }, 2000);
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: "I'm having connection issues right now.\n\nPlease reach us directly:\njuniorreactive@gmail.com\n+256 764 524 816",
        suggestions: ['Contact Us', 'WhatsApp Us'],
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, history, navigate, open]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleSuggestion = (suggestion) => {
    const route = resolveRoute(suggestion);
    if (route) {
      if (route.startsWith('http')) {
        window.open(route, '_blank', 'noopener');
        return;
      }
      navigate(route);
      setOpen(false);
      return;
    }
    sendMessage(suggestion);
  };

  return (
    <>
      {/* ── BUBBLE ─────────────────────────────────────────────────────── */}
      <button
        className={`chatbot-bubble ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className="bubble-icon">
          {open
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          }
        </span>
        {!open && unread > 0 && <span className="bubble-badge">{unread}</span>}
        {!open && <span className="bubble-label">Chat with us</span>}
      </button>

      {/* ── CHAT WINDOW ────────────────────────────────────────────────── */}
      <div className={`chatbot-window ${open ? 'open' : ''}`} role="dialog" aria-label="JR Assistant chat">

        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <span>JR</span>
            <span className="online-dot" />
          </div>
          <div className="chatbot-header-info">
            <h4>JR Assistant</h4>
            <p>AI-powered · Instant replies</p>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`msg msg-${msg.from}`}>
              {msg.from === 'bot' && <div className="msg-avatar">JR</div>}
              <div className="msg-content">
                <div className="msg-bubble">{renderLines(msg.text)}</div>
                {msg.navigate && (
                  <div className="msg-navigate-hint">
                    ↗ Taking you there in 2 seconds...
                  </div>
                )}
                {msg.suggestions && msg.suggestions.length > 0 && msg.from === 'bot' && (
                  <div className="msg-quick">
                    {msg.suggestions.map(s => (
                      <button
                        key={s}
                        className="quick-btn"
                        onClick={() => handleSuggestion(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg msg-bot">
              <div className="msg-avatar">JR</div>
              <div className="msg-content">
                <div className="msg-bubble typing-bubble">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Ask me anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            maxLength={400}
            disabled={loading}
          />
          <button
            className="chatbot-send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>

        <p className="chatbot-footer-note">
          Powered by Llama 3 via Groq · <Link to="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
        </p>
      </div>
    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { v4 as uuidv4 } from 'uuid';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { analyzeLocal, generateFullPage } from './designEngine';
import './AIChatbot.css';

// Suggestions shown on empty state
const CHIPS = [
    'Purple nebula background', 'Make buttons pill-shaped', 'Add neon glow to title',
    'Cyan color theme', 'Add countdown for 7 days', 'Make font Orbitron',
    'Make all buttons red and rounded', 'Add glitch animation to text',
    'Create login page', 'Build a 404 error page',
    'Add a navbar', 'Remove all badges',
    'Make the card glass effect', 'Bold font + larger size',
];

export default function AIChatbot({ onClose }) {
    const {
        currentPage, addPageWithElements,
        setBackground, addElements,
        updateElementsMatching, removeElementsMatching,
    } = useBuilder();

    const [messages, setMessages] = useState([{
        role: 'bot',
        content: `**Hey! I'm your AI Co-Designer.** Tell me what to change on this page — or ask me to build a whole new one.\n\nI understand natural language like:\n*"make the background a purple nebula"*\n*"add glow animation to buttons and make them rounded"*\n*"make all text cyan and bold"*\n*"create a login page for HackArena"*`,
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const addBot = (content, payload = null) => setMessages(p => [...p, { role: 'bot', content, payload }]);
    const replaceLastBot = (content, payload = null) => setMessages(p => {
        const c = [...p];
        const i = c.length - 1 - [...c].reverse().findIndex(m => m.role === 'bot');
        c[i] = { role: 'bot', content, payload };
        return c;
    });

    const applyPayload = (payload) => {
        const { intent, background, newElements, updates, removeMatches, pageName } = payload;

        if (intent === 'create_page') {
            addPageWithElements(pageName || 'AI Page', (newElements || []).map(e => ({ ...e, id: uuidv4() })), background);
            addBot(`✅ **"${pageName}"** page created and switched to! Customize it freely.`);
            return;
        }
        const done = [];
        if (background) { setBackground(background); done.push('background'); }
        if (newElements?.length) { addElements(newElements); done.push(`${newElements.length} element(s) added`); }
        if (updates?.length) { updates.forEach(u => updateElementsMatching(u.matchType, u.matchLabel, u.props, u.style)); done.push('elements updated'); }
        if (removeMatches?.length) { removeMatches.forEach(r => removeElementsMatching(r.matchType, r.matchLabel)); done.push('elements removed'); }
        if (!done.length) addBot("⚠️ I wasn't sure what to change — try being more specific!");
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setMessages(p => [...p, { role: 'user', content: text }]);
        setInput(''); setLoading(true);

        // Simulate brief thinking delay for UX
        await new Promise(r => setTimeout(r, 280));

        try {
            // 1. Local engine — handles 40+ command categories + compound commands
            const result = analyzeLocal(text, currentPage?.elements || []);
            const isCreate = /\b(create|build|generate|design|make)\b.*\b(new\s+)?(page|layout)\b/.test(text.toLowerCase());

            if (result && !isCreate) {
                replaceLastBot(result.reply || '✅ Done!', result);
                applyPayload(result);
                setLoading(false);
                return;
            }

            // 2. Full page generator for page-build requests
            addBot('🔧 Building page...');
            await new Promise(r => setTimeout(r, 350));
            const page = generateFullPage(text);
            replaceLastBot(
                `🎨 **"${page.pageName}"** is ready with **${page.newElements?.length || 0} elements**.\nClick **Apply Page** to add it to your builder!`,
                { ...page, intent: 'create_page' },
            );
        } catch (err) {
            replaceLastBot(`❌ Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chatbot">
            {/* Header */}
            <div className="ai-chatbot-header">
                <Bot size={16} className="ai-bot-icon" />
                <span className="ai-chatbot-title">AI CO-DESIGNER</span>
                <span className="ai-provider-badge">LOCAL AI</span>
                <button className="ai-chatbot-close" onClick={onClose}><X size={14} /></button>
            </div>

            {/* Messages */}
            <div className="ai-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
                        {msg.role === 'bot' && <Bot size={13} className="ai-msg-avatar" />}
                        <div className="ai-msg-content">
                            <SimpleMarkdown text={msg.content} />
                            {msg.payload?.intent === 'create_page' && (
                                <button className="ai-apply-btn" onClick={() => applyPayload(msg.payload)}>
                                    <Sparkles size={13} /> Apply Page
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="ai-msg ai-msg--bot">
                        <Bot size={13} className="ai-msg-avatar" />
                        <div className="ai-typing"><span /><span /><span /></div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestion chips */}
            {messages.length <= 2 && (
                <div className="ai-suggestions">
                    {CHIPS.map(s => (
                        <button key={s} className="ai-suggestion-chip"
                            onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="ai-input-bar">
                <input
                    ref={inputRef}
                    className="ai-input"
                    placeholder="Describe any design change or ask to build a page..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={loading}
                />
                <button className="ai-send-btn" onClick={handleSend} disabled={!input.trim() || loading}>
                    <Send size={14} />
                </button>
            </div>
        </div>
    );
}

function SimpleMarkdown({ text }) {
    return (
        <span>
            {text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p, i) => {
                if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
                if (p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
                return p.split('\n').map((line, j, arr) =>
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>);
            })}
        </span>
    );
}

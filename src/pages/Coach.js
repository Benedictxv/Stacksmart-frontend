import { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import { Send, Bot } from 'lucide-react';

export default function Coach() {
    const { user } = useAuth();
    const theme = useTheme();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [orbActive, setOrbActive] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        getChatHistory()
            .then(res => setMessages(res.data))
            .finally(() => setFetching(false));
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setOrbActive(true);
        try {
            const res = await sendMessage(input);
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }]);
        } finally {
            setLoading(false);
            setOrbActive(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const suggestions = [
        'How am I doing with my goals?',
        'How can I save ₦50k faster?',
        'Give me a savings tip for this week',
        'What should I cut back on?',
    ];

    return (
        <Layout>
            <div style={{ marginBottom: 20 }}>
                <p style={{ color: theme.text, fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.5px' }}>AI Coach</p>
                <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>Your personal financial advisor</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, height: 'calc(100vh - 200px)', minHeight: 500 }} className="coach-layout">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px', background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 20 }}>
                    <div style={{ width: 110, height: 110, borderRadius: '50%', background: theme.isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: orbActive ? '0 0 60px rgba(124,58,237,0.4)' : '0 0 30px rgba(124,58,237,0.1)', transition: 'box-shadow 0.4s', marginBottom: 16 }}>
                        <div style={{ width: 86, height: 86, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2.5s ease-in-out infinite' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: orbActive ? 'radial-gradient(circle at 35% 35%, #a78bfa, #7c3aed, #4c0080)' : 'radial-gradient(circle at 35% 35%, #7c3aed, #4c0080)', position: 'relative', transition: 'background 0.3s' }}>
                                <div style={{ position: 'absolute', top: 10, left: 12, width: 18, height: 12, background: 'rgba(255,255,255,0.25)', borderRadius: '50%', transform: 'rotate(-30deg)' }} />
                            </div>
                        </div>
                    </div>
                    <p style={{ color: theme.text, fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>StackSmart AI</p>
                    <p style={{ color: theme.textMuted, fontSize: 12, margin: 0, textAlign: 'center' }}>
                        {orbActive ? 'Thinking...' : fetching ? 'Loading...' : messages.length === 0 ? `Hey ${user?.name?.split(' ')[0]} 👋` : 'Ready to help'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                        <span style={{ color: '#10b981', fontSize: 11, fontWeight: 600 }}>Online</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {fetching ? (
                            <p style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Loading chat history...</p>
                        ) : messages.length === 0 ? (
                            <div>
                                <p style={{ color: theme.textFaint, fontSize: 11, fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>Try asking:</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {suggestions.map(s => (
                                        <button key={s} style={{ background: theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${theme.bgCardBorder}`, color: theme.textMuted, padding: '12px 16px', borderRadius: 12, cursor: 'pointer', fontSize: 14, textAlign: 'left', fontFamily: 'Inter, sans-serif' }} onClick={() => setInput(s)}>{s}</button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12, alignItems: 'flex-end', gap: 8 }}>
                                    {msg.role === 'assistant' && (
                                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4c0080)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Bot size={12} />
                                        </div>
                                    )}
                                    <div style={msg.role === 'user'
                                        ? { background: '#e8102a', color: 'white', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '70%', fontSize: 14, lineHeight: 1.5 }
                                        : { background: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${theme.bgCardBorder}`, color: theme.text, padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '70%', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }
                                    }>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12, alignItems: 'flex-end', gap: 8 }}>
                                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4c0080)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Bot size={12} />
                                </div>
                                <div style={{ background: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${theme.bgCardBorder}`, padding: '12px 16px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
                                    {[0, 0.2, 0.4].map((delay, i) => (
                                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: theme.textMuted, animation: `dotBounce 1.2s ease-in-out ${delay}s infinite` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div style={{ padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-end', borderTop: `1px solid ${theme.bgCardBorder}` }}>
                        <textarea
                            style={{ flex: 1, padding: '12px 16px', background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 14, color: theme.text, fontSize: 14, resize: 'none', fontFamily: 'Inter, sans-serif', maxHeight: 120, outline: 'none' }}
                            placeholder="Ask your coach anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            rows={1}
                        />
                        <button style={{ width: 44, height: 44, borderRadius: '50%', background: '#e8102a', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, opacity: input.trim() ? 1 : 0.4, transition: 'opacity 0.2s' }} onClick={handleSend} disabled={loading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
                @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-6px); opacity: 1; } }
            `}</style>
        </Layout>
    );
}
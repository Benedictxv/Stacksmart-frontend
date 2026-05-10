import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DoodleBg from '../components/DoodleBg';
import Logo from '../components/Logo';
import { Sun, Moon } from 'lucide-react';

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', income_range: '', spending_habit: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await register(form);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { ...s.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.inputText };
    const labelStyle = { ...s.label, color: theme.textMuted };

    return (
        <div style={{ ...s.page, background: theme.bg }}>
            <DoodleBg />

            <button onClick={theme.toggle} style={{ ...s.themeBtn, background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, color: theme.textMuted }}>
                {theme.isDark ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme.isDark ? 'Light' : 'Dark'}</span>
            </button>

            <div style={{ ...s.card, background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}>
                <div style={s.logoRow}>
                    <Logo size={44} />
                    <div>
                        <p style={{ ...s.logoText, color: theme.text }}>Stack<span style={{ color: '#e8102a' }}>Smart</span></p>
                        <p style={s.logoSub}>SAVE · GROW · WIN</p>
                    </div>
                </div>

                <div style={s.stepRow}>
                    <div style={{ ...s.stepDot, background: step >= 1 ? '#e8102a' : theme.bgCardBorder }} />
                    <div style={{ ...s.stepLine, background: step >= 2 ? '#e8102a' : theme.bgCardBorder }} />
                    <div style={{ ...s.stepDot, background: step >= 2 ? '#e8102a' : theme.bgCardBorder }} />
                </div>

                <p style={{ ...s.welcome, color: theme.text }}>{step === 1 ? 'Create account' : 'Your profile'}</p>
                <p style={{ ...s.welcomeSub, color: theme.textMuted }}>{step === 1 ? 'Step 1 of 2 — Basic info' : 'Step 2 of 2 — Financial profile'}</p>

                {error && <div style={s.error}>{error}</div>}

                {step === 1 ? (
                    <div>
                        <p style={labelStyle}>Full name</p>
                        <input style={inputStyle} name="name" placeholder="Benedict Emwanta" onChange={handleChange} value={form.name} />
                        <p style={labelStyle}>Email address</p>
                        <input style={inputStyle} name="email" placeholder="you@example.com" type="email" onChange={handleChange} value={form.email} />
                        <p style={labelStyle}>Phone number</p>
                        <input style={inputStyle} name="phone" placeholder="08012345678" onChange={handleChange} value={form.phone} />
                        <p style={labelStyle}>Password</p>
                        <input style={inputStyle} name="password" placeholder="••••••••" type="password" onChange={handleChange} value={form.password} />
                        <button style={s.btn} onClick={() => {
                            if (form.name && form.email && form.phone && form.password) { setError(''); setStep(2); }
                            else setError('Please fill all fields');
                        }}>Continue →</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={labelStyle}>Monthly income range</p>
                        <select style={inputStyle} name="income_range" onChange={handleChange} value={form.income_range}>
                            <option value="">Select income range</option>
                            <option value="below_50k">Below ₦50,000</option>
                            <option value="50k_100k">₦50,000 – ₦100,000</option>
                            <option value="100k_300k">₦100,000 – ₦300,000</option>
                            <option value="above_300k">Above ₦300,000</option>
                        </select>
                        <p style={labelStyle}>Spending habit</p>
                        <select style={inputStyle} name="spending_habit" onChange={handleChange} value={form.spending_habit}>
                            <option value="">Select spending habit</option>
                            <option value="saver">I save before I spend</option>
                            <option value="moderate">I try to balance</option>
                            <option value="spender">I spend first, save later</option>
                        </select>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="button" style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
                            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
                        </div>
                    </form>
                )}

                <p style={{ ...s.link, color: theme.textMuted }}>
                    Already have an account? <Link to="/login" style={{ color: '#e8102a', fontWeight: 700 }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    themeBtn: { position: 'fixed', top: 20, right: 20, padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', zIndex: 10 },
    card: { borderRadius: 24, padding: '40px 36px', width: 380, position: 'relative', zIndex: 1, boxShadow: '0 24px 60px rgba(0,0,0,0.12)' },
    logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
    logoText: { fontWeight: 900, fontSize: 22, margin: 0, letterSpacing: '-0.5px' },
    logoSub: { color: 'rgba(150,150,150,0.6)', fontSize: 9, margin: 0, letterSpacing: 2, fontWeight: 500 },
    stepRow: { display: 'flex', alignItems: 'center', marginBottom: 20 },
    stepDot: { width: 10, height: 10, borderRadius: '50%', transition: 'background 0.3s', flexShrink: 0 },
    stepLine: { flex: 1, height: 2, transition: 'background 0.3s' },
    welcome: { fontWeight: 800, fontSize: 22, margin: '0 0 4px', letterSpacing: '-0.3px' },
    welcomeSub: { fontSize: 14, margin: '0 0 24px', fontWeight: 400 },
    label: { fontSize: 12, fontWeight: 500, margin: '0 0 6px', letterSpacing: 0.3 },
    input: { width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none', fontFamily: 'Inter, sans-serif' },
    btn: { flex: 1, width: '100%', padding: 15, background: '#e8102a', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
    backBtn: { padding: '15px 20px', background: 'transparent', borderRadius: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif', border: '1px solid rgba(150,150,150,0.2)', color: 'inherit' },
    error: { background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.2)', color: '#e8102a', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 },
    link: { textAlign: 'center', marginTop: 20, fontSize: 13 },
};
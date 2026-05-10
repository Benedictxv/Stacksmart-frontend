import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DoodleBg from '../components/DoodleBg';
import Logo from '../components/Logo';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await loginApi(form);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

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

                <p style={{ ...s.welcome, color: theme.text }}>Welcome back </p>
                <p style={{ ...s.welcomeSub, color: theme.textMuted }}>Log in to your account</p>

                {error && <div style={s.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <p style={{ ...s.label, color: theme.textMuted }}>Email address</p>
                    <input
                        style={{ ...s.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.inputText }}
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        onChange={handleChange}
                        required
                    />
                    <p style={{ ...s.label, color: theme.textMuted }}>Password</p>
                    <div style={{ position: 'relative' }}>
                        <input
                            style={{ ...s.input, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.inputText }}
                            name="password"
                            placeholder="••••••••"
                            type={showPass ? 'text' : 'password'}
                            onChange={handleChange}
                            required
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                            {showPass
                                ? <EyeOff size={16} color={theme.textMuted} />
                                : <Eye size={16} color={theme.textMuted} />
                            }
                        </button>
                    </div>
                    <button style={s.btn} type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p style={{ ...s.link, color: theme.textMuted }}>
                    Don't have an account? <Link to="/register" style={{ color: '#e8102a', fontWeight: 700 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    themeBtn: { position: 'fixed', top: 20, right: 20, padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', zIndex: 10 },
    card: { borderRadius: 24, padding: '40px 36px', width: 380, position: 'relative', zIndex: 1, boxShadow: '0 24px 60px rgba(0,0,0,0.15)' },
    logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 },
    logoText: { fontWeight: 900, fontSize: 22, margin: 0, letterSpacing: '-0.5px' },
    logoSub: { color: 'rgba(150,150,150,0.6)', fontSize: 9, margin: 0, letterSpacing: 2, fontWeight: 500 },
    welcome: { fontWeight: 800, fontSize: 22, margin: '0 0 4px', letterSpacing: '-0.3px' },
    welcomeSub: { fontSize: 14, margin: '0 0 24px', fontWeight: 400 },
    label: { fontSize: 12, fontWeight: 500, margin: '0 0 6px', letterSpacing: 0.3 },
    input: { width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none', fontFamily: 'Inter, sans-serif' },
    btn: { width: '100%', padding: 15, background: '#e8102a', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, fontFamily: 'Inter, sans-serif', letterSpacing: 0.3 },
    error: { background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.2)', color: '#e8102a', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 },
    link: { textAlign: 'center', marginTop: 20, fontSize: 13 },
    eyeBtn: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-70%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' },
};

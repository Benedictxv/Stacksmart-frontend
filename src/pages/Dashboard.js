import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getGoals, getTransactions, requestWithdrawal } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import { ArrowDownCircle, ArrowUpCircle, Target, Bot, User, Eye, EyeOff, X } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [depositModal, setDepositModal] = useState(false);
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchData = () => {
        Promise.all([getGoals(), getTransactions()])
            .then(([g, t]) => { setGoals(g.data); setTransactions(t.data); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !selectedGoal) return;
        setWithdrawing(true);
        setError('');
        try {
            await requestWithdrawal({ amount: parseFloat(withdrawAmount), goal_id: selectedGoal.id });
            setSuccess('Withdrawal processed successfully!');
            setWithdrawModal(false);
            setWithdrawAmount('');
            setSelectedGoal(null);
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Withdrawal failed');
        } finally {
            setWithdrawing(false);
        }
    };

    const quickActions = [
        { icon: <ArrowDownCircle size={22} color="#10b981" />, label: 'Deposit', bg: theme.isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)', border: theme.isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)', action: () => { if (goals.length === 0) navigate('/goals'); else { setSelectedGoal(goals[0]); setDepositModal(true); } } },
        { icon: <ArrowUpCircle size={22} color="#e8102a" />, label: 'Withdraw', bg: theme.isDark ? 'rgba(232,16,42,0.1)' : 'rgba(232,16,42,0.06)', border: theme.isDark ? 'rgba(232,16,42,0.2)' : 'rgba(232,16,42,0.12)', action: () => { if (goals.length === 0) navigate('/goals'); else { setSelectedGoal(goals[0]); setWithdrawModal(true); } } },
        { icon: <Target size={22} color="#7c3aed" />, label: 'Goals', bg: theme.isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)', border: theme.isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.12)', action: () => navigate('/goals') },
        { icon: <Bot size={22} color="#7c3aed" />, label: 'AI Coach', bg: theme.isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)', border: theme.isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.12)', action: () => navigate('/coach') },
    ];

    return (
        <Layout>
            {success && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '12px 16px', borderRadius: 12, marginBottom: 20, textAlign: 'center', fontSize: 13, fontWeight: 500 }}>
                    {success}
                </div>
            )}

            {/* header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                    <p style={{ color: theme.textMuted, fontSize: 13, margin: 0, fontWeight: 400 }}>{getGreeting()}</p>
                    <p style={{ color: theme.text, fontWeight: 800, fontSize: 26, margin: '4px 0 0', letterSpacing: '-0.5px' }}>{user?.name?.split(' ')[0]} 👋</p>
                </div>
                <div onClick={() => navigate('/profile')} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(232,16,42,0.15)', border: '1.5px solid rgba(232,16,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                    {user?.profile_photo
                        ? <img src={user.profile_photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : <User size={20} color="#e8102a" />
                    }
                </div>
            </div>

            {/* balance card */}
            <div style={{ background: 'linear-gradient(135deg, #e8102a 0%, #a00018 60%, #6B0000 100%)', borderRadius: 20, padding: '24px 28px', marginBottom: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(232,16,42,0.25)' }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: 0, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Total Savings Balance</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                            <p style={{ color: 'white', fontWeight: 900, fontSize: 38, margin: 0, letterSpacing: '-1.5px' }}>
                                {balanceVisible ? `₦${totalSaved.toLocaleString()}` : '₦ ••••••'}
                            </p>
                            <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                                {balanceVisible ? <EyeOff size={18} color="rgba(255,255,255,0.6)" /> : <Eye size={18} color="rgba(255,255,255,0.6)" />}
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
                        <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>Active</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: 4, background: 'white', borderRadius: 99, width: `${Math.min(overallProgress, 100)}%`, transition: 'width 0.5s' }} />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0, fontWeight: 600 }}>{overallProgress.toFixed(1)}%</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>{goals.filter(g => g.status === 'active').length} active goals</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>Target: ₦{totalTarget.toLocaleString()}</p>
                </div>
            </div>

            {/* quick actions */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {quickActions.map(a => (
                    <button key={a.label} onClick={a.action} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, borderRadius: 16, padding: '16px 8px', cursor: 'pointer', transition: 'all 0.15s', background: a.bg, border: `1px solid ${a.border}` }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {a.icon}
                        </div>
                        <p style={{ color: theme.textMuted, fontSize: 12, margin: 0, fontWeight: 500 }}>{a.label}</p>
                    </button>
                ))}
            </div>

            {/* two col */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }} className="two-col">
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 16, padding: '18px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ color: theme.text, fontWeight: 700, fontSize: 14, margin: 0 }}>Your Goals</p>
                        <Link to="/goals" style={{ color: '#e8102a', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>See all →</Link>
                    </div>
                    {loading ? <p style={{ color: theme.textMuted, fontSize: 13 }}>Loading...</p> : goals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <Target size={28} color={theme.textFaint} />
                            <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 10 }}>No goals yet. <Link to="/goals" style={{ color: '#e8102a' }}>Create one</Link></p>
                        </div>
                    ) : goals.slice(0, 4).map((g, i) => (
                        <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: i % 2 === 0 ? '#e8102a' : '#7c3aed', flexShrink: 0 }} />
                                <div>
                                    <p style={{ color: theme.text, fontWeight: 500, fontSize: 13, margin: 0 }}>{g.name}</p>
                                    <p style={{ color: theme.textFaint, fontSize: 11, margin: '2px 0 0' }}>₦{g.current_amount.toLocaleString()} / ₦{g.target_amount.toLocaleString()}</p>
                                </div>
                            </div>
                            <p style={{ color: i % 2 === 0 ? '#e8102a' : '#7c3aed', fontWeight: 700, fontSize: 13, margin: 0 }}>{g.progress}%</p>
                        </div>
                    ))}
                </div>

                <div style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 16, padding: '18px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ color: theme.text, fontWeight: 700, fontSize: 14, margin: 0 }}>Recent Transactions</p>
                        <Link to="/transactions" style={{ color: '#e8102a', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>See all →</Link>
                    </div>
                    {transactions.length === 0 ? (
                        <p style={{ color: theme.textMuted, fontSize: 13 }}>No transactions yet</p>
                    ) : transactions.slice(0, 4).map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.amount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(232,16,42,0.1)' }}>
                                {t.amount > 0 ? <ArrowDownCircle size={15} color="#10b981" /> : <ArrowUpCircle size={15} color="#e8102a" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: theme.text, fontSize: 13, fontWeight: 500, margin: 0 }}>{t.amount > 0 ? 'Deposit' : 'Withdrawal'}</p>
                                <p style={{ color: theme.textFaint, fontSize: 11, margin: '2px 0 0' }}>{new Date(t.paid_at).toLocaleDateString()}</p>
                            </div>
                            <p style={{ color: t.amount > 0 ? '#10b981' : '#e8102a', fontWeight: 700, fontSize: 13, margin: 0 }}>
                                {t.amount > 0 ? '+' : ''}₦{Math.abs(t.amount).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* coach banner */}
            <div style={{ background: theme.isDark ? 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(232,16,42,0.06))' : 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(232,16,42,0.04))', border: `1px solid ${theme.isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.15)'}`, borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate('/coach')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4c0080)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                        <Bot size={20} color="white" />
                    </div>
                    <div>
                        <p style={{ color: theme.text, fontWeight: 700, fontSize: 14, margin: 0 }}>Talk to your AI Coach</p>
                        <p style={{ color: theme.textMuted, fontSize: 12, margin: '3px 0 0' }}>Personalized savings advice based on your goals</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ color: '#10b981', fontSize: 11, fontWeight: 600 }}>Online</span>
                </div>
            </div>

            {/* deposit modal */}
            {depositModal && selectedGoal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: theme.modal, borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 440, border: `1px solid ${theme.bgCardBorder}`, margin: '0 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <p style={{ color: theme.text, fontWeight: 700, fontSize: 17, margin: 0 }}>Deposit funds</p>
                            <button onClick={() => setDepositModal(false)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
                        </div>
                        {goals.length > 1 && (
                            <>
                                <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Select goal</p>
                                <select style={{ width: '100%', padding: '11px 14px', background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }} value={selectedGoal.id} onChange={e => setSelectedGoal(goals.find(g => g.id === parseInt(e.target.value)))}>
                                    {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </>
                        )}
                        <p style={{ color: theme.textMuted, fontSize: 13, margin: '0 0 16px' }}>Transfer to this account from any bank</p>
                        {selectedGoal.virtual_account ? (
                            <>
                                <div style={{ background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 14, padding: '20px', marginBottom: 14, textAlign: 'center' }}>
                                    <p style={{ color: theme.textMuted, fontSize: 11, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Account Number</p>
                                    <p style={{ color: theme.text, fontWeight: 900, fontSize: 26, margin: '0 0 4px', letterSpacing: 2 }}>{selectedGoal.virtual_account.account_number}</p>
                                    <p style={{ color: '#e8102a', fontSize: 13, margin: 0, fontWeight: 600 }}>{selectedGoal.virtual_account.bank_name}</p>
                                </div>
                                <p style={{ color: theme.textFaint, fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>Balance updates automatically once payment is confirmed.</p>
                            </>
                        ) : (
                            <p style={{ color: theme.textMuted, fontSize: 13 }}>No virtual account linked yet.</p>
                        )}
                        <button style={{ width: '100%', padding: 13, background: '#e8102a', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => setDepositModal(false)}>Done</button>
                    </div>
                </div>
            )}

            {/* withdraw modal */}
            {withdrawModal && selectedGoal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: theme.modal, borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 440, border: `1px solid ${theme.bgCardBorder}`, margin: '0 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <p style={{ color: theme.text, fontWeight: 700, fontSize: 17, margin: 0 }}>Withdraw funds</p>
                            <button onClick={() => { setWithdrawModal(false); setError(''); }} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
                        </div>
                        {goals.length > 1 && (
                            <>
                                <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Select goal</p>
                                <select style={{ width: '100%', padding: '11px 14px', background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }} value={selectedGoal.id} onChange={e => setSelectedGoal(goals.find(g => g.id === parseInt(e.target.value)))}>
                                    {goals.map(g => <option key={g.id} value={g.id}>{g.name} — ₦{g.current_amount.toLocaleString()}</option>)}
                                </select>
                            </>
                        )}
                        <p style={{ color: theme.textMuted, fontSize: 13, margin: '0 0 16px' }}>Available: ₦{selectedGoal.current_amount.toLocaleString()}</p>
                        {error && <div style={{ background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.2)', color: '#e8102a', padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{error}</div>}
                        <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Amount (₦)</p>
                        <input style={{ width: '100%', padding: '11px 14px', background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, color: theme.text, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', outline: 'none' }} type="number" placeholder="Enter amount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                        <p style={{ color: theme.textFaint, fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>Funds sent to your registered bank account within 24hrs.</p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button style={{ flex: 1, padding: 13, background: '#e8102a', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={handleWithdraw} disabled={withdrawing}>{withdrawing ? 'Processing...' : 'Withdraw'}</button>
                            <button style={{ padding: '13px 20px', background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => { setWithdrawModal(false); setWithdrawAmount(''); setError(''); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
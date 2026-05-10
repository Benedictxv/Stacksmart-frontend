import { useState, useEffect } from 'react';
import { getGoals, createGoal, deleteGoal, requestWithdrawal } from '../services/api';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Plus, Trash2, ArrowDownCircle, ArrowUpCircle, Target, Calendar, X } from 'lucide-react';

export default function Goals() {
    const theme = useTheme();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', target_amount: '', deadline: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [depositModal, setDepositModal] = useState(null);
    const [withdrawModal, setWithdrawModal] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const inp = { width: '100%', padding: '12px 14px', background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, color: theme.text, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'Inter, sans-serif' };

    const fetchGoals = () => {
        setLoading(true);
        getGoals().then(res => setGoals(res.data)).finally(() => setLoading(false));
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await createGoal(form);
            setShowForm(false);
            setForm({ name: '', target_amount: '', deadline: '' });
            fetchGoals();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create goal');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this goal?')) return;
        await deleteGoal(id);
        fetchGoals();
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !withdrawModal) return;
        setWithdrawing(true);
        try {
            await requestWithdrawal({ amount: parseFloat(withdrawAmount), goal_id: withdrawModal.id });
            setSuccessMsg('Withdrawal processed!');
            setWithdrawModal(null);
            setWithdrawAmount('');
            fetchGoals();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Withdrawal failed');
        } finally {
            setWithdrawing(false);
        }
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <p style={{ color: theme.text, fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.5px' }}>Savings Goals</p>
                    <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>Track and manage your savings</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#e8102a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
                    <Plus size={16} /> New Goal
                </button>
            </div>

            {successMsg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 13 }}>{successMsg}</div>}

            {showForm && (
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 20, padding: '20px 18px', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <p style={{ color: theme.text, fontWeight: 700, fontSize: 15, margin: 0 }}>Create a new goal</p>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    {error && <div style={{ background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.2)', color: '#e8102a', padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Goal name</p>
                        <input style={inp} placeholder="e.g. iPhone Fund" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Target amount (₦)</p>
                        <input style={inp} placeholder="500000" type="number" value={form.target_amount} onChange={e => setForm({ ...form, target_amount: e.target.value })} required />
                        <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Deadline (optional)</p>
                        <input style={inp} type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button style={{ flex: 1, padding: 13, background: '#e8102a', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Goal'}</button>
                            <button style={{ padding: '13px 20px', background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p style={{ color: theme.textMuted, fontSize: 13 }}>Loading your goals...</p>
            ) : goals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <Target size={48} color={theme.textFaint} />
                    <p style={{ color: theme.text, fontWeight: 700, fontSize: 18, margin: '16px 0 4px' }}>No goals yet</p>
                    <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>Tap "New Goal" to create your first savings goal</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }} className="goals-grid">
                    {goals.map(goal => (
                        <div key={goal.id} style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 20, padding: '20px 18px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                <div>
                                    <p style={{ color: theme.text, fontWeight: 700, fontSize: 16, margin: '0 0 6px' }}>{goal.name}</p>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5, background: goal.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(232,16,42,0.1)', color: goal.status === 'completed' ? '#10b981' : '#e8102a' }}>
                                        {goal.status}
                                    </span>
                                </div>
                                <p style={{ color: '#e8102a', fontWeight: 900, fontSize: 20, margin: 0 }}>{goal.progress}%</p>
                            </div>

                            <div style={{ background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 99, height: 8, marginBottom: 10 }}>
                                <div style={{ background: 'linear-gradient(90deg, #e8102a, #ff6b7a)', borderRadius: 99, height: 8, width: `${Math.min(goal.progress, 100)}%`, transition: 'width 0.5s' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <p style={{ color: theme.text, fontWeight: 600, fontSize: 13, margin: 0 }}>₦{goal.current_amount.toLocaleString()} saved</p>
                                <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>of ₦{goal.target_amount.toLocaleString()}</p>
                            </div>

                            {goal.deadline && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                    <Calendar size={12} color={theme.textMuted} />
                                    <p style={{ color: theme.textMuted, fontSize: 12, margin: 0 }}>{new Date(goal.deadline).toLocaleDateString()}</p>
                                </div>
                            )}

                            {goal.virtual_account && (
                                <div style={{ background: theme.isDark ? 'rgba(232,16,42,0.1)' : 'rgba(232,16,42,0.06)', border: `1px solid rgba(232,16,42,0.2)`, borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
                                    <p style={{ color: theme.textMuted, fontSize: 11, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Deposit account</p>
                                    <p style={{ color: theme.text, fontWeight: 800, fontSize: 18, margin: '0 0 2px', letterSpacing: 1 }}>{goal.virtual_account.account_number}</p>
                                    <p style={{ color: '#e8102a', fontSize: 12, margin: 0, fontWeight: 600 }}>{goal.virtual_account.bank_name}</p>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button style={{ flex: 1, padding: '10px 0', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: 'Inter, sans-serif' }} onClick={() => setDepositModal(goal)}>
                                    <ArrowDownCircle size={14} /> Deposit
                                </button>
                                <button style={{ flex: 1, padding: '10px 0', background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.2)', color: '#e8102a', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: 'Inter, sans-serif' }} onClick={() => setWithdrawModal(goal)}>
                                    <ArrowUpCircle size={14} /> Withdraw
                                </button>
                                <button style={{ padding: '10px 14px', background: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: `1px solid ${theme.bgCardBorder}`, color: theme.textMuted, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }} onClick={() => handleDelete(goal.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* deposit modal */}
            {depositModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: theme.modal, borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 440, border: `1px solid ${theme.bgCardBorder}`, margin: '0 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <p style={{ color: theme.text, fontWeight: 700, fontSize: 17, margin: 0 }}>Deposit to {depositModal.name}</p>
                            <button onClick={() => setDepositModal(null)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <p style={{ color: theme.textMuted, fontSize: 13, margin: '0 0 20px' }}>Transfer to this account from any bank</p>
                        {depositModal.virtual_account ? (
                            <>
                                <div style={{ background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 14, padding: '20px', marginBottom: 14, textAlign: 'center' }}>
                                    <p style={{ color: theme.textMuted, fontSize: 11, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Account Number</p>
                                    <p style={{ color: theme.text, fontWeight: 900, fontSize: 26, margin: '0 0 4px', letterSpacing: 2 }}>{depositModal.virtual_account.account_number}</p>
                                    <p style={{ color: '#e8102a', fontSize: 13, margin: 0, fontWeight: 600 }}>{depositModal.virtual_account.bank_name}</p>
                                </div>
                                <p style={{ color: theme.textFaint, fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>Balance updates automatically once payment is confirmed.</p>
                            </>
                        ) : (
                            <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 16 }}>No virtual account linked yet.</p>
                        )}
                        <button style={{ width: '100%', padding: 13, background: '#e8102a', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => setDepositModal(null)}>Done</button>
                    </div>
                </div>
            )}

            {/* withdraw modal */}
            {withdrawModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: theme.modal, borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 440, border: `1px solid ${theme.bgCardBorder}`, margin: '0 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <p style={{ color: theme.text, fontWeight: 700, fontSize: 17, margin: 0 }}>Withdraw from {withdrawModal.name}</p>
                            <button onClick={() => { setWithdrawModal(null); setWithdrawAmount(''); setError(''); }} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <p style={{ color: theme.textMuted, fontSize: 13, margin: '0 0 20px' }}>Available: ₦{withdrawModal.current_amount.toLocaleString()}</p>
                        {error && <div style={{ background: 'rgba(232,16,42,0.1)', border: '1px solid rgba(232,16,42,0.2)', color: '#e8102a', padding: '10px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13 }}>{error}</div>}
                        <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Amount (₦)</p>
                        <input style={inp} type="number" placeholder="Enter amount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                        <p style={{ color: theme.textFaint, fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>Funds sent to your registered bank account within 24hrs.</p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button style={{ flex: 1, padding: 13, background: '#e8102a', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={handleWithdraw} disabled={withdrawing}>{withdrawing ? 'Processing...' : 'Withdraw'}</button>
                            <button style={{ padding: '13px 20px', background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }} onClick={() => { setWithdrawModal(null); setWithdrawAmount(''); setError(''); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
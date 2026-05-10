import { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';

export default function Transactions() {
    const theme = useTheme();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTransactions()
            .then(res => setTransactions(res.data))
            .finally(() => setLoading(false));
    }, []);

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const deposits = transactions.filter(t => t.amount > 0);
    const withdrawals = transactions.filter(t => t.amount < 0);

    return (
        <Layout>
            <div style={{ marginBottom: 24 }}>
                <p style={{ color: theme.text, fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.5px' }}>Transaction History</p>
                <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>All your deposits and withdrawals</p>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                {[
                    { icon: <TrendingUp size={18} color="#e8102a" />, label: 'Net Balance', value: `₦${Math.abs(total).toLocaleString()}`, color: total >= 0 ? '#10b981' : '#e8102a' },
                    { icon: <ArrowDownCircle size={18} color="#10b981" />, label: 'Deposits', value: deposits.length, color: '#10b981' },
                    { icon: <ArrowUpCircle size={18} color="#e8102a" />, label: 'Withdrawals', value: withdrawals.length, color: '#e8102a' },
                ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 16, padding: '16px' }}>
                        <div style={{ marginBottom: 8 }}>{s.icon}</div>
                        <p style={{ color: theme.textMuted, fontSize: 12, margin: '0 0 4px', fontWeight: 600 }}>{s.label}</p>
                        <p style={{ color: s.color, fontWeight: 800, fontSize: 22, margin: 0 }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {loading ? (
                <p style={{ color: theme.textMuted, fontSize: 13 }}>Loading transactions...</p>
            ) : transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <ArrowDownCircle size={48} color={theme.textFaint} />
                    <p style={{ color: theme.text, fontWeight: 700, fontSize: 18, margin: '16px 0 4px' }}>No transactions yet</p>
                    <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>Deposits and withdrawals will appear here</p>
                </div>
            ) : (
                transactions.map(t => (
                    <div key={t.id} style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.amount > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(232,16,42,0.1)' }}>
                            {t.amount > 0 ? <ArrowDownCircle size={20} color="#10b981" /> : <ArrowUpCircle size={20} color="#e8102a" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: theme.text, fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>{t.amount > 0 ? 'Deposit' : 'Withdrawal'}</p>
                            <p style={{ color: theme.textFaint, fontSize: 10, margin: '0 0 2px', fontFamily: 'monospace' }}>{t.squad_ref}</p>
                            <p style={{ color: theme.textMuted, fontSize: 11, margin: 0 }}>{new Date(t.paid_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: t.amount > 0 ? '#10b981' : '#e8102a', fontWeight: 800, fontSize: 15, margin: '0 0 4px' }}>
                                {t.amount > 0 ? '+' : ''}₦{Math.abs(t.amount).toLocaleString()}
                            </p>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', background: t.status === 'confirmed' ? 'rgba(16,185,129,0.1)' : 'rgba(232,16,42,0.1)', color: t.status === 'confirmed' ? '#10b981' : '#e8102a' }}>
                                {t.status}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </Layout>
    );
}
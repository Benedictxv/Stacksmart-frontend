import { useState, useRef } from 'react';
import { updateProfile, uploadPhoto } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import { User, Camera, Mail, Phone, Save } from 'lucide-react';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const theme = useTheme();
    const fileRef = useRef();
    const [form, setForm] = useState({ name: user?.name || '', income_range: user?.income_range || '', spending_habit: user?.spending_habit || '' });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [photo, setPhoto] = useState(user?.profile_photo || null);

    const inp = { width: '100%', padding: '12px 14px', background: theme.input, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, color: theme.text, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none', fontFamily: 'Inter, sans-serif' };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target.result;
            setPhoto(base64);
            await uploadPhoto(base64);
            await refreshUser();
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        await updateProfile(form);
        await refreshUser();
        setSuccess('Profile updated successfully!');
        setSaving(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Layout>
            <div style={{ marginBottom: 24 }}>
                <p style={{ color: theme.text, fontWeight: 800, fontSize: 24, margin: 0, letterSpacing: '-0.5px' }}>Profile</p>
                <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>Manage your account settings</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }} className="profile-layout">
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 20, padding: '28px 20px', textAlign: 'center' }}>
                    <div
                        style={{ width: 100, height: 100, borderRadius: '50%', background: theme.isDark ? 'rgba(232,16,42,0.15)' : 'rgba(232,16,42,0.08)', border: '3px solid #e8102a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', margin: '0 auto 16px' }}
                        onClick={() => fileRef.current.click()}
                    >
                        {photo
                            ? <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <User size={40} color={theme.textFaint} />
                        }
                        <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#e8102a', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={14} color="white" />
                        </div>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                    <p style={{ color: theme.text, fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}>{user?.name}</p>
                    <p style={{ color: theme.textMuted, fontSize: 13, margin: '0 0 20px' }}>{user?.email}</p>
                    <div style={{ borderTop: `1px solid ${theme.bgCardBorder}`, paddingTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${theme.bgCardBorder}` }}>
                            <Mail size={14} color={theme.textMuted} />
                            <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>{user?.email}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                            <Phone size={14} color={theme.textMuted} />
                            <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>{user?.phone}</p>
                        </div>
                    </div>
                </div>

                <div style={{ background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, borderRadius: 20, padding: '24px 20px' }}>
                    <p style={{ color: theme.text, fontWeight: 700, fontSize: 16, margin: '0 0 20px' }}>Personal Information</p>

                    <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Full name</p>
                    <input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                    <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Email address</p>
                    <input style={{ ...inp, opacity: 0.5 }} value={user?.email} disabled />

                    <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Phone number</p>
                    <input style={{ ...inp, opacity: 0.5 }} value={user?.phone} disabled />

                    <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Monthly income range</p>
                    <select style={inp} value={form.income_range} onChange={e => setForm({ ...form, income_range: e.target.value })}>
                        <option value="">Select</option>
                        <option value="below_50k">Below ₦50,000</option>
                        <option value="50k_100k">₦50,000 – ₦100,000</option>
                        <option value="100k_300k">₦100,000 – ₦300,000</option>
                        <option value="above_300k">Above ₦300,000</option>
                    </select>

                    <p style={{ color: theme.textMuted, fontSize: 12, fontWeight: 500, margin: '0 0 6px' }}>Spending habit</p>
                    <select style={inp} value={form.spending_habit} onChange={e => setForm({ ...form, spending_habit: e.target.value })}>
                        <option value="">Select</option>
                        <option value="saver">I save before I spend</option>
                        <option value="moderate">I try to balance</option>
                        <option value="spender">I spend first, save later</option>
                    </select>

                    {success && <p style={{ color: '#10b981', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{success}</p>}

                    <button
                        style={{ width: '100%', padding: 14, background: '#e8102a', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Inter, sans-serif' }}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
import './Layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DoodleBg from './DoodleBg';
import Logo from './Logo';
import { Home, Target, Bot, History, User, LogOut, Sun, Moon } from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Target, label: 'Goals', to: '/goals' },
    { icon: Bot, label: 'Coach', to: '/coach' },
    { icon: History, label: 'History', to: '/transactions' },
    { icon: User, label: 'Profile', to: '/profile' },
];

export default function Layout({ children }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div style={{ ...s.root, background: theme.bg }}>
            <DoodleBg />

            {/* desktop sidebar */}
            <div style={{ ...s.sidebar, background: theme.bgSidebar, borderRight: `1px solid ${theme.bgSidebarBorder}` }} className="sidebar">
                <div style={s.sidebarTop}>
                    <div style={{ ...s.logoWrap, borderBottom: `1px solid ${theme.bgSidebarBorder}` }}>
                        <Logo size={48} />
                        <div>
                            <p style={{ ...s.logoText, color: theme.text }}>Stack<span style={{ color: '#e8102a' }}>Smart</span></p>
                            <p style={s.logoSub}>SAVE · GROW · WIN</p>
                        </div>
                    </div>

                    <p style={s.navLabel}>Navigation</p>
                    <nav style={s.nav}>
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const active = location.pathname === item.to;
                            return (
                                <Link key={item.to} to={item.to} style={{
                                    ...s.navItem,
                                    background: active ? theme.navActive : 'transparent',
                                    borderLeft: active ? '2px solid #e8102a' : '2px solid transparent',
                                    color: active ? theme.text : theme.textMuted,
                                }}>
                                    <Icon size={16} strokeWidth={active ? 2.5 : 1.5} />
                                    <p style={{ ...s.navItemLabel, fontWeight: active ? 600 : 400 }}>{item.label}</p>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={s.sidebarBottom}>
                    <button onClick={theme.toggle} style={{ ...s.themeToggle, background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, color: theme.textMuted }}>
                        {theme.isDark ? <Sun size={14} /> : <Moon size={14} />}
                        <span>{theme.isDark ? 'Light mode' : 'Dark mode'}</span>
                    </button>
                    <div style={{ ...s.userRow, background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}` }}>
                        <div style={s.userAvatar}>
                            {user?.profile_photo
                                ? <img src={user.profile_photo} alt="av" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                : <User size={14} color="white" />
                            }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ ...s.userName, color: theme.text }}>{user?.name?.split(' ')[0]}</p>
                            <p style={{ ...s.userEmail, color: theme.textFaint }}>{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ ...s.logoutBtn, color: theme.textMuted, border: `1px solid ${theme.bgCardBorder}` }}>
                        <LogOut size={13} />
                        Sign out
                    </button>
                </div>
            </div>

            {/* main content */}
            <div style={s.main} className="mainContent">
                <div style={s.content}>
                    {children}
                </div>
            </div>

            {/* mobile theme toggle floating button */}
            <div className="mobileTheme" style={{ position: 'fixed', bottom: 78, right: 16, zIndex: 101 }}>
                <button onClick={theme.toggle} style={{ width: 40, height: 40, borderRadius: '50%', background: theme.bgCard, border: `1px solid ${theme.bgCardBorder}`, color: theme.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {theme.isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
            </div>

            {/* mobile bottom nav */}
            <div style={{ ...s.bottomNav, background: theme.isDark ? 'rgba(6,6,15,0.95)' : 'rgba(255,255,255,0.95)', borderTop: `1px solid ${theme.bgCardBorder}` }} className="bottomNav">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;
                    return (
                        <Link to={item.to} key={item.label} style={{ ...s.bottomNavItem, color: active ? '#e8102a' : theme.textMuted }}>
                            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                            <p style={{ ...s.bottomNavLabel, fontWeight: active ? 600 : 400 }}>{item.label}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

const s = {
    root: { minHeight: '100vh', position: 'relative' },
    sidebar: { position: 'fixed', top: 0, left: 0, width: 240, height: '100vh', flexDirection: 'column', justifyContent: 'space-between', zIndex: 50 },
    sidebarTop: { padding: '0 0 16px' },
    logoWrap: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', marginBottom: 20 },
    logoText: { fontWeight: 800, fontSize: 16, margin: 0, letterSpacing: '-0.3px' },
    logoSub: { color: 'rgba(150,150,150,0.5)', fontSize: 8, margin: 0, letterSpacing: '2px', fontWeight: 500 },
    navLabel: { color: 'rgba(150,150,150,0.4)', fontSize: 10, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px 20px' },
    nav: { display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' },
    navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: '0 10px 10px 0', textDecoration: 'none', transition: 'all 0.15s', marginLeft: -12 },
    navItemLabel: { margin: 0, fontSize: 13 },
    sidebarBottom: { padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 },
    themeToggle: { width: '100%', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' },
    userRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 10 },
    userAvatar: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #e8102a, #8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
    userName: { fontWeight: 600, fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    userEmail: { fontSize: 10, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    logoutBtn: { width: '100%', padding: '8px 0', background: 'transparent', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s', fontFamily: 'Inter, sans-serif' },
    main: { minHeight: '100vh', transition: 'margin-left 0.3s' },
    content: { maxWidth: 860, margin: '0 auto', padding: 'clamp(20px, 4vw, 44px) clamp(16px, 3vw, 36px) 100px', position: 'relative', zIndex: 1 },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, justifyContent: 'space-around', padding: '10px 0 20px', backdropFilter: 'blur(20px)', zIndex: 100 },
    bottomNavItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none' },
    bottomNavLabel: { fontSize: 10, margin: 0 },
};
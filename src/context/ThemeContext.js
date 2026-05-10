import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);
    const toggle = () => setIsDark(!isDark);

    const theme = {
        isDark,
        toggle,
        bg: isDark ? '#06060f' : '#f0f0f5',
        bgCard: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
        bgCardBorder: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)',
        bgSidebar: isDark ? '#09090f' : '#ffffff',
        bgSidebarBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
        text: isDark ? '#ffffff' : '#0f0f1a',
        textMuted: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)',
        textFaint: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)',
        input: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f8',
        inputBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)',
        inputText: isDark ? '#ffffff' : '#0f0f1a',
        navActive: isDark ? 'rgba(232,16,42,0.1)' : 'rgba(232,16,42,0.07)',
        modal: isDark ? '#0f0f1a' : '#ffffff',
        accent: '#e8102a',
        accentPurple: '#7c3aed',
        accentGreen: '#10b981',
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
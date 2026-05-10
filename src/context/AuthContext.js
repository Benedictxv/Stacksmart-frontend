import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(() => {
        return getMe()
            .then(res => setUser(res.data))
            .catch(() => logout());
    }, []);

    useEffect(() => {
        if (token) {
            fetchUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token, fetchUser]);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = () => {
        return fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // logout is defined here using useCallback so it can be a dependency for fetchUser
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    // fetchUser is now wrapped in useCallback to prevent infinite loops
    const fetchUser = useCallback(() => {
        return getMe()
            .then(res => setUser(res.data))
            .catch(() => logout());
    }, [logout]); // logout is a dependency here

    useEffect(() => {
        if (token) {
            fetchUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token, fetchUser]); // Added fetchUser to dependencies to make Render happy

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
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
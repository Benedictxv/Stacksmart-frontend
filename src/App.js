import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Coach from './pages/Coach';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return <div style={{ background: '#06060f', minHeight: '100vh' }} />;
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
                        <Route path="/coach" element={<PrivateRoute><Coach /></PrivateRoute>} />
                        <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
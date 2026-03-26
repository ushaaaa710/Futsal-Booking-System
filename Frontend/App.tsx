import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User, UserRole } from './types';
import { authApi, ApiUser } from './services/api';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/Booking';
import BookingsPage from './pages/Bookings';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/Admin';
import ChatPage from './pages/Chat';
import Landing from './pages/Landing';

// --- Map API user to frontend User type ---
function toFrontendUser(u: ApiUser): User {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role === 'ADMIN' ? UserRole.ADMIN : UserRole.USER,
    walletBalance: u.walletBalance ?? 0,
    avatar: u.avatar,
  };
}

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, asAdmin?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- Protected Route ---
const ProtectedRoute = ({ children, roleRequired }: { children: React.ReactNode, roleRequired?: UserRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Restore session from localStorage, validate token is still good
  useEffect(() => {
    const storedUser = localStorage.getItem('courtsync_user');
    const storedToken = localStorage.getItem('courtsync_token');
    if (storedUser && storedToken) {
      // Optimistically restore, then verify token with backend
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      authApi.getMe().then(({ user: apiUser }) => {
        const fresh = toFrontendUser(apiUser);
        setUser(fresh);
        localStorage.setItem('courtsync_user', JSON.stringify(fresh));
      }).catch(() => {
        // Token expired or invalid — force re-login
        setUser(null);
        localStorage.removeItem('courtsync_user');
        localStorage.removeItem('courtsync_token');
      });
    }
  }, []);

  const login = async (email: string, password: string, asAdmin?: boolean) => {
    // Call real backend
    const { user: apiUser, token } = await authApi.login({ email, password });
    const frontendUser = toFrontendUser(apiUser);
    setUser(frontendUser);
    localStorage.setItem('courtsync_user', JSON.stringify(frontendUser));
    localStorage.setItem('courtsync_token', token);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user: apiUser, token } = await authApi.register({ name, email, password });
    const frontendUser = toFrontendUser(apiUser);
    setUser(frontendUser);
    localStorage.setItem('courtsync_user', JSON.stringify(frontendUser));
    localStorage.setItem('courtsync_token', token);
  };

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem('courtsync_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('courtsync_user');
    localStorage.removeItem('courtsync_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user }}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthContext.Provider>
  );
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/book" element={
          <ProtectedRoute>
            <Layout><BookingPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute>
            <Layout><BookingsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Layout><ChatPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequired={UserRole.ADMIN}>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
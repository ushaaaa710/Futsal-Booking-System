import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User, UserRole } from './types';
import { MOCK_USER, MOCK_ADMIN } from './services/mockData';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/Booking';
import BookingsPage from './pages/Bookings';
import ProfilePage from './pages/Profile';
import AdminDashboard from './pages/Admin';
import ChatPage from './pages/Chat';
import Landing from './pages/Landing';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [registeredUsers, setRegisteredUsers] = useState<Map<string, { name: string; email: string; password: string }>>(new Map());

  // Simulate persistent login checking
  useEffect(() => {
    const storedUser = localStorage.getItem('courtsync_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedUsers = localStorage.getItem('courtsync_users');
    if (storedUsers) {
      setRegisteredUsers(new Map(JSON.parse(storedUsers)));
    }
  }, []);

  const register = async (name: string, email: string, password: string) => {
    // Validate input
    if (!name.trim() || !email.trim() || !password.trim()) {
      throw new Error('All fields are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const userKey = email.toLowerCase();
    if (registeredUsers.has(userKey)) {
      throw new Error('User already registered with this email');
    }

    // Register user
    const newUser = { name, email, password };
    const updatedUsers = new Map(registeredUsers);
    updatedUsers.set(userKey, newUser);
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('courtsync_users', JSON.stringify(Array.from(updatedUsers.entries())));

    // Auto-login after registration
    const userData: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone: '',
      role: UserRole.USER,
      walletBalance: 0,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=00d4ff&color=000`
    };
    setUser(userData);
    localStorage.setItem('courtsync_user', JSON.stringify(userData));
  };

  const login = async (email: string, password: string) => {
    // Validate input
    if (!email.trim() || !password.trim()) {
      throw new Error('Email and password are required');
    }

    // Check if user exists
    const userKey = email.toLowerCase();
    const registeredUser = registeredUsers.get(userKey);

    if (!registeredUser) {
      throw new Error('User not found. Please register first');
    }

    if (registeredUser.password !== password) {
      throw new Error('Invalid password');
    }

    // Login successful
    const userData: User = {
      id: `u_${userKey}`,
      name: registeredUser.name,
      email: registeredUser.email,
      phone: '',
      role: UserRole.USER,
      walletBalance: 0,
      avatar: `https://ui-avatars.com/api/?name=${registeredUser.name}&background=00d4ff&color=000`
    };
    setUser(userData);
    localStorage.setItem('courtsync_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('courtsync_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
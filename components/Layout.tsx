import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  Trophy,
  History,
  User,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Book Court', path: '/book', icon: CalendarDays },
    { name: 'My Bookings', path: '/bookings', icon: History },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: ShieldCheck },
    { name: 'Bookings', path: '/admin?tab=bookings', icon: CalendarDays }, 
    { name: 'Messages', path: '/chat', icon: MessageSquare },
  ];

  const links = user?.role === UserRole.ADMIN ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-background text-white flex overflow-hidden font-sans">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-surface border border-neutral-700 text-white"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-neutral-800 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0
      `}>
        <div className="p-6 flex items-center space-x-2 border-b border-neutral-800 h-20">
          <Trophy className="text-primary w-8 h-8" />
          <span className="text-xl font-bold tracking-tighter uppercase">Court<span className="text-primary">Sync</span></span>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.path + link.name}
              to={link.path}
              end={link.path === '/admin'} // Exact match for admin root
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors border-l-2
                ${isActive 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-neutral-800'}
              `}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-800">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="w-8 h-8 bg-neutral-700 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-background to-background opacity-50 pointer-events-none" />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-8 relative z-10 max-w-7xl mx-auto h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
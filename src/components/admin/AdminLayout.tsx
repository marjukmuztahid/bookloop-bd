import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, ClipboardList, Package, Truck, Users, BarChart3, DollarSign, LogOut, Menu, X, History } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAuth } from '@/hooks/useAuth';
import { useAdminSession } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';
import type { ReactNode } from 'react';

const NAV = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/listings', label: 'Listings Queue', icon: ClipboardList },
  { path: '/admin/orders', label: 'Orders Queue', icon: Package },
  { path: '/admin/deliveries', label: 'Active Deliveries', icon: Truck },
  { path: '/admin/users', label: 'Users', icon: Users },
  
  { path: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { touch, checkSession, expireSession } = useAdminSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!checkSession()) { expireSession(); return; }
    touch();
  }, [location.pathname]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_last_activity');
    await signOut();
    navigate('/admin');
  };

  const Sidebar = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-2 px-4 pt-5">
        <img src={logo} alt="" className="h-7" />
        <span className="text-xs font-medium text-[#8A8A8A]">Admin Panel</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2">
        {NAV.map((n) => {
          const active = location.pathname === n.path;
          return (
            <Link key={n.path} to={n.path} onClick={onNav}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'border-l-[3px] border-[#E8357A] bg-[rgba(232,53,122,0.06)] text-[#E8357A]'
                  : 'border-l-[3px] border-transparent text-[#8A8A8A] hover:text-[#3A3A3A]'
              }`}>
              <n.icon size={16} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-4">
        <p className="mb-2 truncate text-xs text-[#8A8A8A]">{user?.email}</p>
        <GlassButton variant="destructive" className="w-full text-xs" onClick={handleLogout}>
          <LogOut size={14} className="mr-1.5" /> Logout
        </GlassButton>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="glass-panel fixed left-0 top-0 hidden h-screen w-60 rounded-none border-r border-[rgba(0,0,0,0.06)] md:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/20" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="glass-panel fixed left-0 top-0 z-[70] h-screen w-60 rounded-none">
              <Sidebar onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[rgba(0,0,0,0.06)] bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={20} className="text-[#3A3A3A]" />
            </button>
            <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#8A8A8A] sm:block">
              {time.toLocaleDateString()} • {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <GlassBadge variant="curriculum">Admin</GlassBadge>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

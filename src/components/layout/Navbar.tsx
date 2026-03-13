import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from '@/components/layout/NotificationBell';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { user, signOut } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const blurAmount = useTransform(scrollY, [0, 100], [20, 28]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0.06, 0.12]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSell = () => {
    navigate(user ? '/sell' : '/login');
  };

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate('/');
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 h-16"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: useTransform(blurAmount, (v) => `blur(${v}px) saturate(160%)`),
          WebkitBackdropFilter: useTransform(blurAmount, (v) => `blur(${v}px) saturate(160%)`),
          borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(0, 0, 0, ${v})`),
        }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Book Loop BD" className="h-[56px] w-auto" width={112} height={56} loading="eager" fetchPriority="high" />
          </Link>

          <form onSubmit={handleSearch} className="mx-8 hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={18} />
              <input type="text" placeholder="Search by book name, author..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] py-2 pl-10 pr-4 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 ease-in-out focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]" />
            </div>
          </form>

          <div className="flex items-center gap-2">
            {user && <NotificationBell />}

            <div className="hidden md:flex md:items-center md:gap-3">
              <GlassButton onClick={handleSell}>Sell a Book</GlassButton>
              {!user ? (
                <GlassButton variant="secondary" onClick={() => navigate('/login')}>Login</GlassButton>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setShowDropdown(!showDropdown)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(232,53,122,0.10)] text-[#E8357A] transition-colors hover:bg-[rgba(232,53,122,0.20)]"
                    aria-label="User menu">
                    <User size={18} />
                  </button>
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="glass-panel-sm absolute right-0 top-12 w-48 overflow-hidden p-1">
                        <DropdownItem icon={<LayoutDashboard size={16} />} label="My Dashboard" onClick={() => { navigate('/dashboard'); setShowDropdown(false); }} />
                        <DropdownItem icon={<UserCircle size={16} />} label="My Profile" onClick={() => { navigate('/dashboard?tab=profile'); setShowDropdown(false); }} />
                        <DropdownItem icon={<LogOut size={16} />} label="Logout" onClick={handleLogout} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <button className="flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
              onClick={() => setShowMobileMenu(true)} aria-label="Open menu">
              <Menu size={22} className="text-[#3A3A3A]" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/20" onClick={() => setShowMobileMenu(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="glass-panel fixed bottom-0 left-0 right-0 z-[70] rounded-b-none p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1A1A1A]">Menu</span>
                <button onClick={() => setShowMobileMenu(false)} aria-label="Close menu">
                  <X size={20} className="text-[#8A8A8A]" />
                </button>
              </div>

              <form onSubmit={(e) => { handleSearch(e); setShowMobileMenu(false); }} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={18} />
                  <input type="text" placeholder="Search by book name, author..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] py-2.5 pl-10 pr-4 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]" />
                </div>
              </form>

              <div className="flex flex-col gap-2">
                <GlassButton className="w-full" onClick={() => { handleSell(); setShowMobileMenu(false); }}>Sell a Book</GlassButton>
                {!user ? (
                  <GlassButton variant="secondary" className="w-full" onClick={() => { navigate('/login'); setShowMobileMenu(false); }}>Login</GlassButton>
                ) : (
                  <>
                    <GlassButton variant="secondary" className="w-full" onClick={() => { navigate('/dashboard'); setShowMobileMenu(false); }}>My Dashboard</GlassButton>
                    <GlassButton variant="secondary" className="w-full" onClick={() => { navigate('/notifications'); setShowMobileMenu(false); }}>Notifications</GlassButton>
                    <GlassButton variant="destructive" className="w-full" onClick={() => { handleLogout(); setShowMobileMenu(false); }}>Logout</GlassButton>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const DropdownItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button onClick={onClick}
    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#3A3A3A] transition-colors hover:bg-[rgba(232,53,122,0.06)] hover:text-[#E8357A]">
    {icon}
    {label}
  </button>
);

export default Navbar;

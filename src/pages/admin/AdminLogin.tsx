import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { pageTransition } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { showToast('Fill in all fields', 'error'); return; }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check admin
      const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!admin) {
        await supabase.auth.signOut();
        showToast('Access denied. Admin accounts only.', 'error');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('admin_last_activity', Date.now().toString());
      showToast('Welcome, Admin!', 'success');
      navigate('/admin/dashboard');
    } catch {
      showToast('Incorrect email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div {...pageTransition} className="glass-panel w-full max-w-[420px] p-8">
        <div className="mb-4 flex justify-center">
          <img src={logo} alt="Book Loop BD" className="h-8" />
        </div>
        <h1 className="mb-1 text-center text-xl font-bold text-[#1A1A1A]">Admin Panel</h1>
        <p className="mb-6 text-center text-sm text-[#8A8A8A]">Book Loop BD Internal Dashboard</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS} placeholder="admin@bookloopbd.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} className={`${INPUT_CLASS} pr-10`} placeholder="Your password" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <GlassButton type="submit" className="mt-2 w-full py-3" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Login to Admin Panel'}
          </GlassButton>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

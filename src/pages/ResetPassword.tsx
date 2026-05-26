import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { pageTransition } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const queryParams = new URLSearchParams(window.location.search);

    const establishRecoverySession = async () => {
      const tokenHash = queryParams.get('token_hash') || hashParams.get('token_hash');
      const type = queryParams.get('type') || hashParams.get('type');

      if (type === 'recovery' && tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });

        if (!error) {
          setIsRecovery(true);
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsRecovery(true);
      }

      setCheckingLink(false);
    };

    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
        setCheckingLink(false);
      }
    });

    void establishRecoverySession();

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast('Password updated successfully!', 'success');
      navigate('/login', { replace: true });
    } catch (err: any) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (checkingLink) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div {...pageTransition} className="glass-panel w-full max-w-[440px] p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Link to="/"><img src={logo} alt="Book Loop BD" className="h-12" /></Link>
          </div>
          <Loader2 size={22} className="mx-auto mb-4 animate-spin text-[#E8357A]" />
          <h1 className="mb-2 text-xl font-bold text-[#1A1A1A]">Checking reset link</h1>
          <p className="text-sm text-[#8A8A8A]">Please wait a moment while we verify your password reset link.</p>
        </motion.div>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div {...pageTransition} className="glass-panel w-full max-w-[440px] p-8 text-center">
          <div className="mb-6 flex justify-center">
            <Link to="/"><img src={logo} alt="Book Loop BD" className="h-12" /></Link>
          </div>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,53,122,0.10)]">
            <span className="text-2xl">🔗</span>
          </div>
          <h1 className="mb-2 text-xl font-bold text-[#1A1A1A]">Invalid or Expired Link</h1>
          <p className="mb-6 text-sm text-[#8A8A8A]">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/login">
            <GlassButton className="w-full py-3">Back to Login</GlassButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div {...pageTransition} className="glass-panel w-full max-w-[440px] p-8">
        <div className="mb-6 flex justify-center">
          <Link to="/"><img src={logo} alt="Book Loop BD" className="h-12" /></Link>
        </div>
        <h1 className="mb-1 text-center text-xl font-bold text-[#1A1A1A]">Set New Password</h1>
        <p className="mb-6 text-center text-sm text-[#8A8A8A]">Enter your new password below</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">New Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={`${INPUT_CLASS} pr-10`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Confirm Password</label>
            <input type={showPassword ? 'text' : 'password'} placeholder="Re-enter your password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className={INPUT_CLASS} />
          </div>

          <GlassButton type="submit" className="mt-2 w-full py-3" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
          </GlassButton>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

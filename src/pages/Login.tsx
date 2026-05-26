import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { pageTransition } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const submitPasswordResetForm = (email: string, redirectTo: string) => {
  const iframeName = 'password-reset-transport';
  const action = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-password-reset`;

  let iframe = document.querySelector(`iframe[name="${iframeName}"]`) as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.target = iframeName;
  form.style.display = 'none';

  const emailInput = document.createElement('input');
  emailInput.type = 'hidden';
  emailInput.name = 'email';
  emailInput.value = email;

  const redirectInput = document.createElement('input');
  redirectInput.type = 'hidden';
  redirectInput.name = 'redirectTo';
  redirectInput.value = redirectTo;

  form.append(emailInput, redirectInput);
  document.body.appendChild(form);
  form.submit();
  form.remove();
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useAppToast();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('redirect') || (location.state as any)?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast('Welcome back!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast('Incorrect email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showToast('Please enter your email address first', 'error');
      return;
    }

    setResetLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      submitPasswordResetForm(email.trim(), redirectTo);
      showToast('If an account exists for this email, a reset link has been sent. Check your inbox and spam folder.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset email', 'error');
    } finally {
      window.setTimeout(() => setResetLoading(false), 800);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div {...pageTransition} className="glass-panel w-full max-w-[440px] p-8">
        <div className="mb-6 flex justify-center">
          <Link to="/"><img src={logo} alt="Book Loop BD" className="h-12" /></Link>
        </div>
        <h1 className="mb-1 text-center text-xl font-bold text-[#1A1A1A]">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-[#8A8A8A]">Log in to your Book Loop BD account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Email Address</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className={INPUT_CLASS} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={`${INPUT_CLASS} pr-10`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="button" onClick={handleForgotPassword} disabled={resetLoading}
              className="mt-1.5 text-xs text-[#8A8A8A] transition-colors hover:text-[#E8357A] disabled:opacity-50">
              {resetLoading ? 'Sending reset link...' : 'Forgot password?'}
            </button>
          </div>

          <GlassButton type="submit" className="mt-2 w-full py-3" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Login'}
          </GlassButton>
        </form>

        <p className="mt-5 text-center text-sm text-[#8A8A8A]">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#E8357A] transition-colors hover:opacity-80">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

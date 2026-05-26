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

const APP_ORIGIN = window.location.origin.includes('lovableproject.com')
  ? window.location.origin
  : `${window.location.protocol}//${window.location.hostname.replace(/^id-preview--/, '').replace(/\.lovable\.app$/, '.lovableproject.com')}`;

const triggerPasswordResetFallback = async (email: string, redirectTo: string) => {
  const endpoint = new URL(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/recover`);
  endpoint.searchParams.set('apikey', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  endpoint.searchParams.set('redirect_to', redirectTo);

  const response = await new Promise<number>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', endpoint.toString(), true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = () => resolve(request.status);
    request.onerror = () => reject(new Error('Network request failed'));
    request.ontimeout = () => reject(new Error('Network request timed out'));
    request.timeout = 15000;
    request.send(JSON.stringify({ email }));
  });

  if (response >= 400 && response !== 429) {
    throw new Error('Failed to send reset email');
  }
};

const isLikelyPreviewFetchFailure = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /failed to fetch|fetch failed|network request failed/i.test(message);
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
      const normalizedEmail = email.trim();
      const redirectTo = `${APP_ORIGIN}/reset-password`;

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });
        if (error) throw error;
      } catch (error) {
        if (!isLikelyPreviewFetchFailure(error)) {
          throw error;
        }

        await triggerPasswordResetFallback(normalizedEmail, redirectTo);
      }

      showToast('If an account exists for this email, a reset link has been sent. Check your inbox and spam folder.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset email', 'error');
    } finally {
      setResetLoading(false);
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

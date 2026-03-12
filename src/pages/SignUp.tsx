import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { pageTransition } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import { BANGLADESH_DISTRICTS } from '@/data/districts';
import logo from '@/assets/logo.png';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const ERROR_INPUT = 'border-[rgba(255,69,58,0.50)]';

const SignUp = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', phone: '', district: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^01\d{9}$/.test(form.phone)) e.phone = 'Must be 11 digits starting with 01';
    if (!form.district) e.district = 'Select a district';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo: window.location.origin },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed');

      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        district: form.district,
      });

      if (profileError) throw profileError;

      localStorage.setItem('howItWorksShown', 'false');
      showToast('Account created successfully!', 'success');
      navigate('/', { state: { showWalkthrough: true } });
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div {...pageTransition} className="glass-panel w-full max-w-[480px] p-8">
        <div className="mb-6 flex justify-center">
          <Link to="/"><img src={logo} alt="Book Loop BD" className="h-12" /></Link>
        </div>
        <h1 className="mb-1 text-center text-xl font-bold text-[#1A1A1A]">Create your account</h1>
        <p className="mb-6 text-center text-sm text-[#8A8A8A]">Join thousands of students on Book Loop BD</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full Name" error={errors.fullName}>
            <input type="text" placeholder="Your full name" value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              className={`${INPUT_CLASS} ${errors.fullName ? ERROR_INPUT : ''}`} />
          </Field>

          <Field label="Email Address" error={errors.email}>
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={`${INPUT_CLASS} ${errors.email ? ERROR_INPUT : ''}`} />
          </Field>

          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Create a password"
                value={form.password} onChange={(e) => set('password', e.target.value)}
                className={`${INPUT_CLASS} pr-10 ${errors.password ? ERROR_INPUT : ''}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <Field label="Confirm Password" error={errors.confirmPassword}>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)}
                className={`${INPUT_CLASS} pr-10 ${errors.confirmPassword ? ERROR_INPUT : ''}`} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          <Field label="Phone Number" error={errors.phone}>
            <input type="tel" placeholder="01XXXXXXXXX" value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={`${INPUT_CLASS} ${errors.phone ? ERROR_INPUT : ''}`} />
          </Field>

          <Field label="District" error={errors.district}>
            <select value={form.district} onChange={(e) => set('district', e.target.value)}
              className={`${INPUT_CLASS} appearance-none ${!form.district ? 'text-[#8A8A8A]' : ''} ${errors.district ? ERROR_INPUT : ''}`}>
              <option value="">Select your district</option>
              {BANGLADESH_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          <GlassButton type="submit" className="mt-2 w-full py-3" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
          </GlassButton>
        </form>

        <p className="mt-5 text-center text-sm text-[#8A8A8A]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#E8357A] transition-colors hover:opacity-80">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-[#C0392B]">{error}</p>}
  </div>
);

export default SignUp;

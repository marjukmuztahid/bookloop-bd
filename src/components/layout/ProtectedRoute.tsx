import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GlassButton } from '@/components/ui/GlassButton';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8357A] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (profile?.is_banned) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="glass-panel max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,69,58,0.10)]">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="mb-2 text-lg font-bold text-[#1A1A1A]">Account Suspended</h2>
          <p className="mb-6 text-sm text-[#8A8A8A]">
            Your account has been suspended. Contact us for support.
          </p>
          <GlassButton variant="secondary" onClick={() => window.location.href = 'mailto:support@bookloopbd.com'}>
            Contact Support
          </GlassButton>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

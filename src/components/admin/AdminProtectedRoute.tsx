import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { ReactNode } from 'react';

const AdminProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { setChecking(false); return; }

    supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data);
        setChecking(false);
      });
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8357A] border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin" replace />;

  // Check session timeout
  const last = sessionStorage.getItem('admin_last_activity');
  if (!last || Date.now() - parseInt(last) > 2 * 60 * 60 * 1000) {
    sessionStorage.removeItem('admin_last_activity');
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;

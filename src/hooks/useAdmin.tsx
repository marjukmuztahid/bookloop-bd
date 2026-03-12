import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAppToast } from '@/components/ui/GlassToast';

const SESSION_KEY = 'admin_last_activity';
const TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours

export const useAdminSession = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();

  const touch = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  }, []);

  const checkSession = useCallback(() => {
    const last = sessionStorage.getItem(SESSION_KEY);
    if (!last) return false;
    return Date.now() - parseInt(last) < TIMEOUT_MS;
  }, []);

  const expireSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    showToast('Session expired. Please log in again.', 'error');
    navigate('/admin');
  }, [navigate, showToast]);

  return { touch, checkSession, expireSession };
};

export const logActivity = async (eventType: string, description: string) => {
  await supabase.from('activity_log').insert({ event_type: eventType, description } as any);
};

export const notifyUser = async (userId: string, message: string) => {
  await supabase.from('notifications').insert({ user_id: userId, message });
};

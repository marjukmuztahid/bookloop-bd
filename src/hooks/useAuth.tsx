import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  district: string;
  bkash_nagad_number: string | null;
  payment_method: string | null;
  detailed_address: string | null;
  is_banned: boolean;
  created_at: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  ensureProfile: (defaults?: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  ensureProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRequestRef = useRef(0);

  const clearAuthState = useCallback(() => {
    profileRequestRef.current += 1;
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  const fetchProfile = useCallback(async (userId: string) => {
    const requestId = ++profileRequestRef.current;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (requestId !== profileRequestRef.current) return;
    setProfile(error ? null : (data as Profile | null));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const ensureProfile = useCallback(async (defaults?: Partial<Profile>) => {
    const { data: authUser } = await supabase.auth.getUser();
    const currentUser = authUser.user;

    if (!currentUser) return;

    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (existingProfile) {
      setProfile(existingProfile as Profile);
      return;
    }

    const fallbackName = defaults?.full_name || currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;
    const fallbackPhone = defaults?.phone || currentUser.user_metadata?.phone;
    const fallbackDistrict = defaults?.district || currentUser.user_metadata?.district;

    if (!fallbackName || !fallbackPhone || !fallbackDistrict) {
      setProfile(null);
      return;
    }

    const { data: insertedProfile, error } = await supabase
      .from('users')
      .insert({
        id: currentUser.id,
        full_name: fallbackName,
        phone: fallbackPhone,
        district: fallbackDistrict,
      })
      .select('*')
      .single();

    if (!error) {
      setProfile(insertedProfile as Profile);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncAuthenticatedUser = async (nextUser: SupabaseUser | null, nextSession?: Session | null) => {
      if (!mounted) return;

      if (!nextUser) {
        clearAuthState();
        return;
      }

      setUser(nextUser);
      setSession(nextSession ?? null);
      await fetchProfile(nextUser.id);
      await ensureProfile();
    };

    let unsubscribe = () => {};

    const initAuth = async () => {
      try {
        const { data: { user: authenticatedUser } } = await supabase.auth.getUser();
        if (!mounted) return;

        if (authenticatedUser) {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          await syncAuthenticatedUser(authenticatedUser, currentSession);
        } else {
          clearAuthState();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        void syncAuthenticatedUser(nextSession?.user ?? null, nextSession);
        setLoading(false);
      });

      unsubscribe = () => subscription.unsubscribe();
    };

    void initAuth();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [clearAuthState, ensureProfile, fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearAuthState();
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile, ensureProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

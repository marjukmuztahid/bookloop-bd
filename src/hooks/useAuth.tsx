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
    // Set up auth listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchProfile(session.user.id), 0);
          setTimeout(() => ensureProfile(), 0);
        } else {
          profileRequestRef.current += 1;
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        ensureProfile();
      } else {
        profileRequestRef.current += 1;
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [ensureProfile, fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    profileRequestRef.current += 1;
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile, ensureProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

const INPUT_CLASS = 'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const UsersPage = () => {
  const { showToast } = useAppToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [banModal, setBanModal] = useState<{ id: string; name: string; ban: boolean } | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    let result = data || [];
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter((u: any) =>
        u.full_name?.toLowerCase().includes(s) || u.district?.toLowerCase().includes(s) || u.phone?.includes(s)
      );
    }
    setUsers(result);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetch(); }, [fetch]);

  const confirmBan = async () => {
    if (!banModal) return;
    await supabase.from('users').update({ is_banned: banModal.ban }).eq('id', banModal.id);
    showToast(banModal.ban ? 'User banned' : 'User unbanned', 'success');
    setBanModal(null);
    fetch();
  };

  return (
    <AdminLayout title="Users">
      <div className="mb-4">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, district, phone"
            className={`${INPUT_CLASS} py-2 pl-8 text-xs`} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <div key={u.id} className="glass-panel-sm flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-[#1A1A1A]">{u.full_name}</h4>
                <p className="text-xs text-[#8A8A8A]">{u.district} • {u.phone} • Since {new Date(u.created_at).toLocaleDateString()}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {u.bkash_nagad_number
                    ? <GlassBadge variant="new" className="text-[10px]">bKash saved</GlassBadge>
                    : <GlassBadge variant="worn" className="text-[10px]">No payment info</GlassBadge>}
                  {u.is_banned
                    ? <GlassBadge variant="fair" className="text-[10px]">Banned</GlassBadge>
                    : <GlassBadge variant="new" className="text-[10px]">Active</GlassBadge>}
                </div>
              </div>
              <div className="flex-shrink-0">
                {u.is_banned ? (
                  <GlassButton variant="success" className="py-1 text-[10px]"
                    onClick={() => setBanModal({ id: u.id, name: u.full_name, ban: false })}>Unban</GlassButton>
                ) : (
                  <GlassButton variant="destructive" className="py-1 text-[10px]"
                    onClick={() => setBanModal({ id: u.id, name: u.full_name, ban: true })}>Ban User</GlassButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {banModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setBanModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">
                {banModal.ban ? 'Ban User' : 'Unban User'}
              </h3>
              <p className="mb-5 text-sm text-[#8A8A8A]">
                {banModal.ban ? `Ban "${banModal.name}"? They won't be able to use the platform.` : `Unban "${banModal.name}"?`}
              </p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setBanModal(null)}>Cancel</GlassButton>
                <GlassButton variant={banModal.ban ? 'destructive' : 'success'} className="flex-1" onClick={confirmBan}>
                  Confirm
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default UsersPage;

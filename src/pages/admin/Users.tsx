import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

const INPUT_CLASS = 'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

type Stats = {
  email: string | null;
  listings: { total: number; pending: number; available: number; sold: number; rejected: number; removed: number };
  buyer: { total: number; successful: number; unsuccessful: number; inProgress: number };
  seller: { total: number; successful: number; unsuccessful: number; inProgress: number };
};

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-[#8A8A8A]">{label}</div>
    <div className="text-sm font-medium text-[#1A1A1A] break-words">{value || <span className="text-[#8A8A8A]">Not provided</span>}</div>
  </div>
);

const StatCard = ({ label, value, tone = 'default' }: { label: string; value: number; tone?: 'default' | 'success' | 'danger' | 'warn' }) => {
  const colors: Record<string, string> = {
    default: 'text-[#1A1A1A]',
    success: 'text-emerald-600',
    danger: 'text-red-600',
    warn: 'text-amber-600',
  };
  return (
    <div className="glass-panel-sm p-3 text-center">
      <div className={`text-xl font-bold ${colors[tone]}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-[#8A8A8A] mt-0.5">{label}</div>
    </div>
  );
};

const UsersPage = () => {
  const { showToast } = useAppToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [banModal, setBanModal] = useState<{ id: string; name: string; ban: boolean } | null>(null);
  const [detailUser, setDetailUser] = useState<any | null>(null);
  const [detailStats, setDetailStats] = useState<Stats | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const openDetails = async (user: any) => {
    setDetailUser(user);
    setDetailStats(null);
    setDetailLoading(true);
    try {
      const [listingsRes, buyerOrdersRes, sellerOrdersRes, emailRes] = await Promise.all([
        supabase.from('listings').select('status').eq('seller_id', user.id),
        supabase.from('orders').select('status').eq('buyer_id', user.id),
        supabase.from('orders').select('status, listings!inner(seller_id)').eq('listings.seller_id', user.id),
        supabase.rpc('get_user_email', { _user_id: user.id }),
      ]);

      const listings = listingsRes.data || [];
      const buyerOrders = buyerOrdersRes.data || [];
      const sellerOrders = sellerOrdersRes.data || [];

      const bucket = (rows: { status: string }[]) => {
        const successful = rows.filter((r) => r.status === 'delivered').length;
        const unsuccessful = rows.filter((r) => r.status === 'unsuccessful' || r.status === 'cancelled').length;
        return { total: rows.length, successful, unsuccessful, inProgress: rows.length - successful - unsuccessful };
      };

      setDetailStats({
        email: (emailRes.data as string | null) || null,
        listings: {
          total: listings.length,
          pending: listings.filter((l: any) => l.status === 'pending').length,
          available: listings.filter((l: any) => l.status === 'available').length,
          sold: listings.filter((l: any) => l.status === 'sold_pending_delivery' || l.status === 'sold').length,
          rejected: listings.filter((l: any) => l.status === 'rejected').length,
          removed: listings.filter((l: any) => l.status === 'removed').length,
        },
        buyer: bucket(buyerOrders),
        seller: bucket(sellerOrders),
      });
    } catch (e) {
      showToast('Failed to load user details', 'error');
    } finally {
      setDetailLoading(false);
    }
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
              <div className="flex flex-shrink-0 gap-2">
                <GlassButton variant="secondary" className="py-1 text-[10px]" onClick={() => openDetails(u)}>
                  See Details
                </GlassButton>
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

        {detailUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDetailUser(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{detailUser.full_name}</h3>
                  <p className="text-xs text-[#8A8A8A]">Member since {new Date(detailUser.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setDetailUser(null)} className="rounded-full p-1 hover:bg-black/5">
                  <X size={18} className="text-[#8A8A8A]" />
                </button>
              </div>

              <section className="mb-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#E8357A]">Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Full Name" value={detailUser.full_name} />
                  <Field label="Email" value={detailLoading ? '…' : detailStats?.email} />
                  <Field label="Phone" value={detailUser.phone} />
                  <Field label="District" value={detailUser.district} />
                  <div className="sm:col-span-2"><Field label="Detailed Address" value={detailUser.detailed_address} /></div>
                  <Field label="Status" value={detailUser.is_banned
                    ? <GlassBadge variant="fair" className="text-[10px]">Banned</GlassBadge>
                    : <GlassBadge variant="new" className="text-[10px]">Active</GlassBadge>} />
                </div>
              </section>

              <section className="mb-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#E8357A]">Payment Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Payment Method" value={detailUser.payment_method} />
                  <Field label="bKash / Nagad Number" value={detailUser.bkash_nagad_number} />
                </div>
              </section>

              <section className="mb-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#E8357A]">Listings</h4>
                {detailLoading || !detailStats ? (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <StatCard label="Total" value={detailStats.listings.total} />
                    <StatCard label="Pending" value={detailStats.listings.pending} tone="warn" />
                    <StatCard label="Available" value={detailStats.listings.available} tone="success" />
                    <StatCard label="Sold" value={detailStats.listings.sold} tone="success" />
                    <StatCard label="Rejected" value={detailStats.listings.rejected} tone="danger" />
                    <StatCard label="Removed" value={detailStats.listings.removed} />
                  </div>
                )}
              </section>

              <section className="mb-5">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#E8357A]">Orders as Buyer</h4>
                {detailLoading || !detailStats ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[1,2,3,4].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    <StatCard label="Total" value={detailStats.buyer.total} />
                    <StatCard label="Successful" value={detailStats.buyer.successful} tone="success" />
                    <StatCard label="Unsuccessful" value={detailStats.buyer.unsuccessful} tone="danger" />
                    <StatCard label="In Progress" value={detailStats.buyer.inProgress} tone="warn" />
                  </div>
                )}
              </section>

              <section className="mb-2">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#E8357A]">Orders as Seller</h4>
                {detailLoading || !detailStats ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[1,2,3,4].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    <StatCard label="Total Sales" value={detailStats.seller.total} />
                    <StatCard label="Successful" value={detailStats.seller.successful} tone="success" />
                    <StatCard label="Unsuccessful" value={detailStats.seller.unsuccessful} tone="danger" />
                    <StatCard label="In Progress" value={detailStats.seller.inProgress} tone="warn" />
                  </div>
                )}
              </section>

              <div className="mt-5 flex justify-end">
                <GlassButton variant="secondary" onClick={() => setDetailUser(null)}>Close</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default UsersPage;

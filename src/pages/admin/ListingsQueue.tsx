import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import { logActivity, notifyUser } from '@/hooks/useAdmin';
import AdminLayout from '@/components/admin/AdminLayout';

const INPUT_CLASS = 'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';
const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const ListingsQueue = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string; sellerId: string } | null>(null);
  const [removeModal, setRemoveModal] = useState<{ id: string; name: string; sellerId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('listings').select('*, users!listings_seller_id_fkey(full_name, district)').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    if (search.trim()) q = q.ilike('book_name', `%${search.trim()}%`);
    const { data } = await q;
    setListings(data || []);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const approve = async (l: any) => {
    await supabase.from('listings').update({ status: 'available' }).eq('id', l.id);
    await logActivity('listing_approved', `Listing "${l.book_name}" approved`);
    await notifyUser(l.seller_id, `Your listing for "${l.book_name}" has been approved and is now live!`);
    showToast('Listing approved', 'success');
    fetch();
  };

  const confirmReject = async () => {
    if (!rejectModal || !rejectReason.trim()) { showToast('Please provide a reason', 'error'); return; }
    await supabase.from('listings').update({ status: 'rejected', rejection_reason: rejectReason.trim() } as any).eq('id', rejectModal.id);
    await logActivity('listing_rejected', `Listing "${rejectModal.name}" rejected`);
    await notifyUser(rejectModal.sellerId, `Your listing for "${rejectModal.name}" was not approved. Reason: ${rejectReason.trim()}`);
    showToast('Listing rejected', 'success');
    setRejectModal(null);
    setRejectReason('');
    fetch();
  };

  const confirmRemove = async () => {
    if (!removeModal) return;
    await supabase.from('listings').delete().eq('id', removeModal.id);
    await logActivity('listing_removed', `Listing "${removeModal.name}" removed by admin`);
    await notifyUser(removeModal.sellerId, `Your listing for "${removeModal.name}" has been removed by the admin.`);
    showToast('Listing removed', 'success');
    setRemoveModal(null);
    fetch();
  };

  const statusBadge = (s: string) => {
    const map: Record<string, any> = { pending: ['Pending', 'good'], available: ['Available', 'new'], rejected: ['Rejected', 'fair'], sold: ['Sold', 'worn'], sold_pending_delivery: ['Order in Progress', 'fair'] };
    const [label, variant] = map[s] || [s, 'worn'];
    return <GlassBadge variant={variant}>{label}</GlassBadge>;
  };

  return (
    <AdminLayout title="Listings Queue">
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'pending', 'available', 'rejected', 'sold', 'deleted', 'expired'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${filter === f ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]' : 'bg-[rgba(0,0,0,0.04)] text-[#8A8A8A]'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search book name"
            className={`${INPUT_CLASS} py-1.5 pl-8 text-xs`} />
        </div>
      </div>

      {loading ? <SkeletonRows /> : !listings.length ? (
        <p className="py-10 text-center text-sm text-[#8A8A8A]">No listings found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((l) => (
            <div key={l.id} className="glass-panel-sm flex flex-wrap items-center gap-3 p-3">
              <img src={l.photos?.[0] || '/placeholder.svg'} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-[#1A1A1A]">{l.book_name}</h4>
                <p className="text-xs text-[#8A8A8A]">{l.author_publisher} • {l.users?.full_name}, {l.users?.district}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <GlassBadge variant="curriculum" className="text-[10px]">{l.curriculum}</GlassBadge>
                  <GlassBadge variant="worn" className="text-[10px]">{l.class_level}</GlassBadge>
                  <span className="text-xs font-bold text-[#E8357A]">{formatPrice(l.display_price)}</span>
                  <span className="text-[10px] text-[#8A8A8A]">Qty: {l.quantity ?? 1}</span>
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                {statusBadge(l.status)}
                <p className="text-[10px] text-[#8A8A8A]">{new Date(l.created_at).toLocaleDateString()}</p>
                {l.status === 'pending' && (
                  <div className="flex gap-1.5">
                    <GlassButton variant="success" className="py-1 text-[10px]" onClick={() => approve(l)}>Approve</GlassButton>
                    <GlassButton variant="destructive" className="py-1 text-[10px]"
                      onClick={() => setRejectModal({ id: l.id, name: l.book_name, sellerId: l.seller_id })}>Reject</GlassButton>
                  </div>
                )}
                {l.status === 'available' && (
                  <GlassButton variant="destructive" className="py-1 text-[10px]"
                    onClick={() => setRemoveModal({ id: l.id, name: l.book_name, sellerId: l.seller_id })}>Remove</GlassButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }}>
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Reject Listing</h3>
        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          className={`${INPUT_CLASS} min-h-[80px] resize-none`} placeholder="Reason for rejection" />
        <div className="mt-4 flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</GlassButton>
          <GlassButton variant="destructive" className="flex-1" onClick={confirmReject}>Confirm Rejection</GlassButton>
        </div>
      </Modal>

      {/* Remove Modal */}
      <Modal open={!!removeModal} onClose={() => setRemoveModal(null)}>
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Remove Listing?</h3>
        <p className="mb-4 text-sm text-[#8A8A8A]">This will remove the listing and notify the seller.</p>
        <div className="flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => setRemoveModal(null)}>Cancel</GlassButton>
          <GlassButton variant="destructive" className="flex-1" onClick={confirmRemove}>Remove</GlassButton>
        </div>
      </Modal>
    </AdminLayout>
  );
};

const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="glass-panel max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const SkeletonRows = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />)}
  </div>
);

export default ListingsQueue;

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CalendarDays } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import { logActivity, notifyUser } from '@/hooks/useAdmin';
import { calculatePlatformFee } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { sendEmail, getUserEmail, sellerOrderApproved, buyerOrderApproved } from '@/lib/email';

const INPUT_CLASS = 'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';
const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const TIME_SLOTS = ['Morning (9am–12pm)', 'Afternoon (12pm–4pm)', 'Evening (4pm–7pm)'];

const OrdersQueue = () => {
  const { showToast } = useAppToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [pickupModal, setPickupModal] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupSlot, setPickupSlot] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('orders')
      .select('*, listings(*, users!listings_seller_id_fkey(full_name, district, phone)), buyer:users!orders_buyer_id_fkey(full_name, district, phone)')
      .order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    let result = data || [];
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter((o: any) =>
        o.listings?.book_name?.toLowerCase().includes(s) || o.buyer?.full_name?.toLowerCase().includes(s)
      );
    }
    setOrders(result);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const approveOrder = async (o: any) => {
    await supabase.from('orders').update({ status: 'approved' }).eq('id', o.id);
    // Quantity already decremented at order placement — no listing update needed here
    await logActivity('order_approved', `Order for "${o.listings?.book_name}" approved`);
    await notifyUser(o.buyer_id, `Your order for "${o.listings?.book_name}" has been approved! Get ready to receive it.`);
    if (o.listings?.seller_id) {
      await notifyUser(o.listings.seller_id, `Your book "${o.listings.book_name}" has been ordered and approved. Steadfast will contact you for pickup.`);
    }
    showToast('Order approved', 'success');
    fetch();

    // Send emails in background (non-blocking)
    const bookTitle = o.listings?.book_name || 'your book';
    const sellerId = o.listings?.seller_id;
    const sellerName = (o.listings?.users?.full_name || 'Seller').split(' ')[0];
    const buyerName = (o.buyer?.full_name || 'Customer').split(' ')[0];

    if (sellerId) {
      getUserEmail(sellerId).then((sellerEmail) => {
        if (sellerEmail) {
          const { subject, html } = sellerOrderApproved(sellerName, bookTitle);
          sendEmail(sellerEmail, subject, html);
        }
      });
    }
    getUserEmail(o.buyer_id).then((buyerEmail) => {
      if (buyerEmail) {
        const { subject, html } = buyerOrderApproved(buyerName, bookTitle, o.delivery_address, o.total_amount);
        sendEmail(buyerEmail, subject, html);
      }
    });
  };

  const confirmReject = async () => {
    if (!rejectModal) return;
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', rejectModal.id);
    // Restore quantity since it was decremented at order placement
    const currentQty = rejectModal.listings?.quantity ?? 0;
    await supabase.from('listings').update({ 
      quantity: currentQty + 1, 
      status: 'available' 
    } as any).eq('id', rejectModal.listing_id);
    await logActivity('order_rejected', `Order for "${rejectModal.listings?.book_name}" rejected`);
    await notifyUser(rejectModal.buyer_id, `Your order for "${rejectModal.listings?.book_name}" was not approved.`);
    showToast('Order rejected', 'success');
    setRejectModal(null);
    setRejectReason('');
    fetch();
  };

  const confirmPickup = async () => {
    if (!pickupModal || !pickupDate) { showToast('Select a date', 'error'); return; }
    await supabase.from('orders').update({ status: 'pickup_scheduled', pickup_scheduled_at: pickupDate }).eq('id', pickupModal.id);
    await logActivity('pickup_scheduled', `Pickup scheduled for "${pickupModal.listings?.book_name}"`);
    if (pickupModal.listings?.seller_id) {
      await notifyUser(pickupModal.listings.seller_id, `Steadfast will pick up your book "${pickupModal.listings.book_name}" on ${new Date(pickupDate).toLocaleDateString()} during ${pickupSlot || 'the day'}. Please be available.`);
    }
    await notifyUser(pickupModal.buyer_id, `Your book is being picked up by Steadfast on ${new Date(pickupDate).toLocaleDateString()}. Delivery coming soon!`);
    showToast('Pickup scheduled', 'success');
    setPickupModal(null);
    setPickupDate('');
    setPickupSlot('');
    fetch();
  };

  const statusBadge = (s: string) => {
    const map: Record<string, any> = { pending: ['Pending', 'good'], approved: ['Approved', 'new'], pickup_scheduled: ['Pickup Scheduled', 'fair'], in_transit: ['In Transit', 'good'], delivered: ['Delivered', 'new'], unsuccessful: ['Unsuccessful', 'worn'], cancelled: ['Cancelled', 'worn'] };
    const [label, variant] = map[s] || [s, 'worn'];
    return <GlassBadge variant={variant}>{label}</GlassBadge>;
  };

  return (
    <AdminLayout title="Orders Queue">
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'pending', 'approved'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${filter === f ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]' : 'bg-[rgba(0,0,0,0.04)] text-[#8A8A8A]'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search"
            className={`${INPUT_CLASS} py-1.5 pl-8 text-xs`} />
        </div>
      </div>

      {loading ? <SkeletonRows /> : !orders.length ? (
        <p className="py-10 text-center text-sm text-[#8A8A8A]">No orders found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => {
            const l = o.listings;
            return (
              <div key={o.id} className="glass-panel-sm p-4">
                {/* Header: Book info + status */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={l?.photos?.[0] || '/placeholder.svg'} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A]">{l?.book_name}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#E8357A]">{formatPrice(l?.display_price || 0)}</span>
                        <span className="text-xs text-[#8A8A8A]">Del: {formatPrice(o.delivery_charge)}</span>
                        <span className="text-xs text-[#8A8A8A]">Weight: {l?.weight_kg} kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                    {statusBadge(o.status)}
                    <p className="text-[10px] text-[#8A8A8A]">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Seller & Buyer details */}
                <div className="grid grid-cols-1 gap-2 rounded-xl bg-[rgba(0,0,0,0.03)] p-3 text-xs sm:grid-cols-2">
                  <div>
                    <p className="mb-1 font-semibold text-[#3A3A3A]">Seller</p>
                    <p className="text-[#5A5A5A]">{l?.users?.full_name}</p>
                    <p className="text-[#8A8A8A]">{l?.users?.district}</p>
                    <p className="text-[#8A8A8A]">{l?.users?.phone}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-[#3A3A3A]">Buyer</p>
                    <p className="text-[#5A5A5A]">{o.buyer?.full_name}</p>
                    <p className="text-[#8A8A8A]">{o.delivery_address}</p>
                    <p className="text-[#8A8A8A]">{o.delivery_phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#3A3A3A]">COD Total: <span className="text-[#E8357A]">{formatPrice(o.total_amount)}</span></span>
                  <div className="flex gap-1.5">
                    {o.status === 'pending' && (
                      <>
                        <GlassButton variant="success" className="py-1 text-[10px]" onClick={() => approveOrder(o)}>Approve</GlassButton>
                        <GlassButton variant="destructive" className="py-1 text-[10px]" onClick={() => setRejectModal(o)}>Reject</GlassButton>
                      </>
                    )}
                    {o.status === 'approved' && (
                      <GlassButton className="py-1 text-[10px]" onClick={() => setPickupModal(o)}>
                        <CalendarDays size={12} className="mr-1" /> Schedule Pickup
                      </GlassButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }}>
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Reject Order</h3>
        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          className={`${INPUT_CLASS} min-h-[80px] resize-none`} placeholder="Reason (optional)" />
        <div className="mt-4 flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</GlassButton>
          <GlassButton variant="destructive" className="flex-1" onClick={confirmReject}>Confirm</GlassButton>
        </div>
      </Modal>

      {/* Pickup Modal */}
      <Modal open={!!pickupModal} onClose={() => setPickupModal(null)}>
        <h3 className="mb-4 text-base font-bold text-[#1A1A1A]">Schedule Steadfast Pickup</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Pickup Date</label>
            <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} className={INPUT_CLASS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Time Slot</label>
            <select value={pickupSlot} onChange={(e) => setPickupSlot(e.target.value)}
              className={`${INPUT_CLASS} appearance-none`}>
              <option value="">Select time slot</option>
              {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => setPickupModal(null)}>Cancel</GlassButton>
          <GlassButton className="flex-1" onClick={confirmPickup}>Confirm Pickup</GlassButton>
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

export default OrdersQueue;

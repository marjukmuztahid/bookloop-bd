import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import { logActivity, notifyUser } from '@/hooks/useAdmin';
import { calculatePlatformFee } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { sendEmail, getUserEmail, sellerDeliverySuccessful, sellerDeliveryUnsuccessful, buyerDeliverySuccessful, buyerDeliveryUnsuccessful } from '@/lib/email';

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const ActiveDeliveries = () => {
  const { showToast } = useAppToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{ order: any; action: 'delivered' | 'unsuccessful' } | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('orders')
      .select('*, listings(*, users!listings_seller_id_fkey(full_name, district, bkash_nagad_number)), buyer:users!orders_buyer_id_fkey(full_name, district)')
      .in('status', ['pickup_scheduled', 'in_transit'])
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const confirmAction = async () => {
    if (!actionModal) return;
    const { order: o, action } = actionModal;
    const l = o.listings;

    if (action === 'delivered') {
      await supabase.from('orders').update({ status: 'delivered' }).eq('id', o.id);
      await supabase.from('listings').update({ status: 'sold' }).eq('id', o.listing_id);
      await logActivity('delivery_confirmed', `"${l?.book_name}" delivered successfully`);
      await notifyUser(o.buyer_id, `Your book "${l?.book_name}" has been delivered! Enjoy your studies.`);
    if (l?.seller_id) {
        const price = l.seller_price || 0;
        const fee = calculatePlatformFee(price);
        const sellerAmount = price; // Seller gets their full asking price
        await notifyUser(l.seller_id, `Your book "${l.book_name}" was delivered successfully. Your payment of ${formatPrice(sellerAmount)} will be sent to your bKash/Nagad shortly.`);
      }
      showToast('Delivery confirmed', 'success');

      // Send delivery success emails (non-blocking)
      const bookTitle = l?.book_name || 'your book';
      const sellerName = (l?.users?.full_name || 'Seller').split(' ')[0];
      const buyerName = (o.buyer?.full_name || 'Customer').split(' ')[0];
      const price = l?.seller_price || 0;
      const payoutAmount = price; // Seller gets their full asking price

      if (l?.seller_id) {
        getUserEmail(l.seller_id).then((email) => {
          if (email) {
            const { subject, html } = sellerDeliverySuccessful(sellerName, bookTitle, payoutAmount);
            sendEmail(email, subject, html);
          }
        });
      }
      getUserEmail(o.buyer_id).then((email) => {
        if (email) {
          const { subject, html } = buyerDeliverySuccessful(buyerName, bookTitle);
          sendEmail(email, subject, html);
        }
      });
    } else {
      await supabase.from('orders').update({ status: 'unsuccessful' }).eq('id', o.id);
      await supabase.from('listings').update({ status: 'available' }).eq('id', o.listing_id);
      await logActivity('delivery_unsuccessful', `Delivery failed for "${l?.book_name}"`);
      await notifyUser(o.buyer_id, `Delivery of "${l?.book_name}" was unsuccessful. Please contact us if you have questions.`);
      if (l?.seller_id) {
        await notifyUser(l.seller_id, `Delivery of your book "${l.book_name}" was unsuccessful. Your listing is live again.`);
      }
      showToast('Marked as unsuccessful', 'info');

      // Send delivery unsuccessful emails (non-blocking)
      const bookTitleFail = l?.book_name || 'your book';
      const sellerNameFail = (l?.users?.full_name || 'Seller').split(' ')[0];
      const buyerNameFail = (o.buyer?.full_name || 'Customer').split(' ')[0];

      if (l?.seller_id) {
        getUserEmail(l.seller_id).then((email) => {
          if (email) {
            const { subject, html } = sellerDeliveryUnsuccessful(sellerNameFail, bookTitleFail);
            sendEmail(email, subject, html);
          }
        });
      }
      getUserEmail(o.buyer_id).then((email) => {
        if (email) {
          const { subject, html } = buyerDeliveryUnsuccessful(buyerNameFail, bookTitleFail);
          sendEmail(email, subject, html);
        }
      });
    }
    setActionModal(null);
    fetch();
  };

  return (
    <AdminLayout title="Active Deliveries">
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />)}
        </div>
      ) : !orders.length ? (
        <p className="py-10 text-center text-sm text-[#8A8A8A]">No active deliveries</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => {
            const l = o.listings;
            return (
              <div key={o.id} className="glass-panel-sm p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <img src={l?.photos?.[0] || '/placeholder.svg'} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{l?.book_name}</h4>
                    <div className="mt-1 flex flex-col gap-0.5 text-xs text-[#8A8A8A]">
                      <p>📦 Buyer: {o.buyer?.full_name} • {o.delivery_address}</p>
                      <p>📞 {o.delivery_phone}</p>
                      <p>🏪 Seller: {l?.users?.full_name} ({l?.users?.district})</p>
                      {o.pickup_scheduled_at && <p>📅 Pickup: {new Date(o.pickup_scheduled_at).toLocaleDateString()}</p>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-bold text-[#E8357A]">COD {formatPrice(o.total_amount)}</span>
                      <GlassBadge variant={o.status === 'in_transit' ? 'good' : 'fair'}>
                        {o.status === 'in_transit' ? 'In Transit' : 'Pickup Scheduled'}
                      </GlassBadge>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <GlassButton variant="success" className="flex-1 text-xs"
                    onClick={() => setActionModal({ order: o, action: 'delivered' })}>Mark Delivered</GlassButton>
                  <GlassButton variant="destructive" className="flex-1 text-xs"
                    onClick={() => setActionModal({ order: o, action: 'unsuccessful' })}>Mark Unsuccessful</GlassButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {actionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setActionModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">
                {actionModal.action === 'delivered' ? 'Confirm Delivery' : 'Mark as Unsuccessful'}
              </h3>
              <p className="mb-5 text-sm text-[#8A8A8A]">
                {actionModal.action === 'delivered'
                  ? `Confirm delivery of "${actionModal.order.listings?.book_name}" to ${actionModal.order.buyer?.full_name}?`
                  : 'Mark delivery as unsuccessful? The listing will be restored.'}
              </p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setActionModal(null)}>Cancel</GlassButton>
                <GlassButton
                  variant={actionModal.action === 'delivered' ? 'success' : 'destructive'}
                  className="flex-1" onClick={confirmAction}>
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

export default ActiveDeliveries;

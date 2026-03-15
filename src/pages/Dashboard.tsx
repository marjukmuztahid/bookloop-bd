import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ShoppingBag, User, Plus, MoreVertical, Heart, Trash2, ExternalLink, X as XIcon, RefreshCw } from 'lucide-react';
import { pageTransition, fadeUp } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge, type BadgeVariant } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BANGLADESH_DISTRICTS } from '@/data/districts';
import useDocumentTitle from '@/hooks/useDocumentTitle';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const TABS = [
  { id: 'listings', label: 'My Listings', icon: BookOpen },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'profile', label: 'My Profile', icon: User },
] as const;

type TabId = typeof TABS[number]['id'];

const Dashboard = () => {
  const navigate = useNavigate();
  useDocumentTitle('My Dashboard');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useAppToast();
  const [activeTab, setActiveTab] = useState<TabId>((searchParams.get('tab') as TabId) || 'listings');

  const switchTab = (tab: TabId) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main {...pageTransition} className="mx-auto max-w-6xl px-4 pb-16 pt-24">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Hi, {firstName} 👋</h1>
          <GlassButton onClick={() => navigate('/sell')}>
            <Plus size={16} className="mr-1.5" /> Post a Book
          </GlassButton>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar — desktop */}
          <nav className="hidden w-56 flex-shrink-0 md:block">
            <div className="glass-panel sticky top-24 p-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'border-l-[3px] border-[#E8357A] bg-[rgba(232,53,122,0.06)] text-[#E8357A]'
                      : 'border-l-[3px] border-transparent text-[#8A8A8A] hover:text-[#3A3A3A]'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-full bg-[rgba(0,0,0,0.04)] p-1 md:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]'
                    : 'text-[#8A8A8A]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} {...fadeUp}>
                {activeTab === 'listings' && <MyListings />}
                {activeTab === 'orders' && <MyOrders />}
                {activeTab === 'profile' && <MyProfile />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

/* ═══════════════ MY LISTINGS ═══════════════ */
const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useAppToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [stockModal, setStockModal] = useState<any>(null);
  const [stockQty, setStockQty] = useState(1);

  const fetch = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    setListings(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const removeListing = async (id: string) => {
    const { error } = await supabase.from('listings').update({ status: 'removed' }).eq('id', id);
    if (error) { showToast('Failed to remove listing', 'error'); return; }
    showToast('Listing removed', 'success');
    setConfirmDelete(null);
    fetch();
  };

  const renewListing = async (id: string) => {
    const newExpiry = new Date(Date.now() + 60 * 86400000).toISOString();
    const { error } = await supabase.from('listings').update({
      expires_at: newExpiry,
      expiry_warning_sent: false,
    } as any).eq('id', id);
    if (error) { showToast('Failed to renew', 'error'); return; }
    showToast('Listing renewed for 60 more days!', 'success');
    fetch();
  };

  const getStatusBadge = (l: any) => {
    const daysLeft = Math.ceil((new Date(l.expires_at).getTime() - Date.now()) / 86400000);
    if (l.status === 'pending') return <GlassBadge variant="good">Awaiting admin review</GlassBadge>;
    if (l.status === 'available' && daysLeft <= 7) return <GlassBadge variant="fair">Expiring Soon</GlassBadge>;
    if (l.status === 'available') return <GlassBadge variant="new">Live on marketplace</GlassBadge>;
    if (l.status === 'sold' || l.status === 'sold_pending_delivery') return <GlassBadge variant="worn">Sold</GlassBadge>;
    if (l.status === 'rejected') return <GlassBadge variant="fair">Rejected</GlassBadge>;
    return <GlassBadge variant="worn">{l.status}</GlassBadge>;
  };

  const isExpiringSoon = (l: any) => {
    if (l.status !== 'available') return false;
    const daysLeft = Math.ceil((new Date(l.expires_at).getTime() - Date.now()) / 86400000);
    return daysLeft <= 7;
  };

  if (loading) return <SkeletonList count={3} />;

  if (!listings.length) {
    return (
      <div className="glass-panel flex flex-col items-center p-10 text-center">
        <BookOpen size={40} className="mb-3 text-[#8A8A8A]" />
        <h3 className="mb-1 text-base font-bold text-[#1A1A1A]">You haven't listed any books yet</h3>
        <p className="mb-4 text-sm text-[#8A8A8A]">Start selling your used textbooks today</p>
        <GlassButton onClick={() => navigate('/sell')}>Post Your First Book</GlassButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {listings.map((l) => (
        <div
          key={l.id}
          className={`glass-panel-sm relative flex items-center gap-3 p-3 ${openMenu === l.id ? 'z-30' : 'z-0'}`}
        >
          <img src={l.photos?.[0] || '/placeholder.svg'} alt={l.book_name}
            className="h-[72px] w-[72px] flex-shrink-0 rounded-[10px] object-cover" />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold text-[#1A1A1A]">{l.book_name}</h4>
            <p className="text-xs text-[#8A8A8A]">{l.author_publisher}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <GlassBadge variant="curriculum" className="text-[10px]">{l.curriculum}</GlassBadge>
              <span className="text-sm font-bold text-[#E8357A]">{formatPrice(l.display_price)}</span>
              {l.status === 'available' && <span className="text-[10px] text-[#8A8A8A]">Qty: {l.quantity ?? 1}</span>}
            </div>
          </div>
          <div className="flex flex-shrink-0 flex-col items-end gap-2">
            {getStatusBadge(l)}
            <div className="relative">
              <button onClick={() => setOpenMenu(openMenu === l.id ? null : l.id)}
                className="rounded-lg p-1.5 text-[#8A8A8A] transition-colors hover:bg-[rgba(0,0,0,0.04)]">
                <MoreVertical size={16} />
              </button>
              {openMenu === l.id && (
                <div className="glass-panel-sm absolute right-0 top-8 z-50 w-44 p-1">
                  <MenuBtn label="View on Marketplace" onClick={() => { navigate(`/listings/${l.id}`); setOpenMenu(null); }} />
                  <MenuBtn label="Update Stock" onClick={() => { setStockModal(l); setStockQty(l.quantity ?? 1); setOpenMenu(null); }} />
                  {l.status === 'available' && (
                    <MenuBtn label="Remove Listing" danger onClick={() => { setConfirmDelete(l.id); setOpenMenu(null); }} />
                  )}
                </div>
              )}
            </div>
            {isExpiringSoon(l) && (
              <GlassButton variant="secondary" className="mt-1 py-1 text-[10px]" onClick={() => renewListing(l.id)}>
                <RefreshCw size={12} className="mr-1" /> Renew
              </GlassButton>
            )}
          </div>
        </div>
      ))}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Remove this listing?</h3>
              <p className="mb-5 text-sm text-[#8A8A8A]">This will take it off the marketplace.</p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</GlassButton>
                <GlassButton variant="destructive" className="flex-1" onClick={() => removeListing(confirmDelete)}>Remove</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Update Modal */}
      <AnimatePresence>
        {stockModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setStockModal(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">
                {(stockModal.status === 'sold' || stockModal.status === 'sold_pending_delivery') ? 'Restock Listing' : 'Update Available Copies'}
              </h3>
              <p className="mb-3 text-sm text-[#8A8A8A]">Currently: {stockModal.quantity ?? 1} copies in stock</p>
              <input type="number" value={stockQty} onChange={(e) => setStockQty(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className={INPUT_CLASS} min={1} max={50} />
              <div className="mt-4 flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setStockModal(null)}>Cancel</GlassButton>
                <GlassButton className="flex-1" onClick={async () => {
                  const updates: any = { quantity: stockQty };
                  if ((stockModal.status === 'sold' || stockModal.status === 'sold_pending_delivery') && stockQty >= 1) updates.status = 'available';
                  const { error } = await supabase.from('listings').update(updates).eq('id', stockModal.id);
                  if (error) { showToast('Failed to update stock', 'error'); return; }
                  showToast('Stock updated successfully', 'success');
                  setStockModal(null);
                  fetch();
                }}>Save</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuBtn = ({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) => (
  <button onClick={onClick}
    className={`flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
      danger ? 'text-[#C0392B] hover:bg-[rgba(255,69,58,0.06)]' : 'text-[#3A3A3A] hover:bg-[rgba(0,0,0,0.04)]'
    }`}>
    {label}
  </button>
);

/* ═══════════════ MY ORDERS ═══════════════ */
const MyOrders = () => {
  const { user } = useAuth();
  const { showToast } = useAppToast();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState<'buying' | 'selling'>('buying');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    if (subTab === 'buying') {
      const { data } = await supabase
        .from('orders')
        .select('*, listings(*)')
        .eq('buyer_id', user.id)
        .eq('buyer_hidden', false)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } else {
      // Selling orders: orders on my listings
      const { data: myListings } = await supabase
        .from('listings')
        .select('id')
        .eq('seller_id', user.id);
      const ids = myListings?.map((l: any) => l.id) || [];
      if (!ids.length) { setOrders([]); setLoading(false); return; }
      const { data } = await supabase
        .from('orders')
        .select('*, listings(*)')
        .in('listing_id', ids)
        .eq('seller_hidden', false)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    }
    setLoading(false);
  }, [user, subTab]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const cancelOrder = async (orderId: string) => {
    const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
    if (error) { showToast('Failed to cancel order', 'error'); return; }
    showToast('Order cancelled', 'success');
    setConfirmCancel(null);
    fetchOrders();
  };

  const hideOrder = async (orderId: string) => {
    const hiddenField = subTab === 'selling' ? 'seller_hidden' : 'buyer_hidden';
    const { error } = await supabase.from('orders').update({ [hiddenField]: true } as any).eq('id', orderId);
    if (error) { showToast('Failed to remove order', 'error'); return; }
    showToast('Order removed from your history', 'success');
    setConfirmHide(null);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const statusLabel = (status: string, isSelling: boolean) => {
    const labels: Record<string, [string, BadgeVariant]> = isSelling ? {
      pending: ['Pending buyer approval', 'good'],
      approved: ["Buyer's order approved", 'new'],
      pickup_scheduled: ['Steadfast pickup scheduled', 'fair'],
      in_transit: ['In transit to buyer', 'good'],
      delivered: ['Delivered — payment coming', 'new'],
      unsuccessful: ['Delivery failed — listing restored', 'fair'],
      cancelled: ['Cancelled', 'worn'],
    } : {
      pending: ['Waiting for admin approval', 'good'],
      approved: ['Order approved', 'new'],
      pickup_scheduled: ['Pickup scheduled', 'fair'],
      in_transit: ['On the way to you', 'good'],
      delivered: ['Delivered', 'new'],
      unsuccessful: ['Delivery unsuccessful', 'fair'],
      cancelled: ['Cancelled', 'worn'],
    };
    const [label, variant] = labels[status] || [status, 'worn' as BadgeVariant];
    return <GlassBadge variant={variant}>{label}</GlassBadge>;
  };

  return (
    <div>
      <div className="mb-4 flex w-fit gap-1 rounded-full bg-[rgba(0,0,0,0.04)] p-1">
        <PillBtn active={subTab === 'buying'} onClick={() => setSubTab('buying')}>Buying</PillBtn>
        <PillBtn active={subTab === 'selling'} onClick={() => setSubTab('selling')}>Selling</PillBtn>
      </div>

      {loading ? <SkeletonList count={2} /> : !orders.length ? (
        <div className="glass-panel flex flex-col items-center p-10 text-center">
          <ShoppingBag size={40} className="mb-3 text-[#8A8A8A]" />
          <h3 className="text-base font-bold text-[#1A1A1A]">No orders yet</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => {
            const listing = o.listings;
            return (
              <div key={o.id} className="glass-panel-sm flex items-center gap-3 p-3">
                <img src={listing?.photos?.[0] || '/placeholder.svg'} alt={listing?.book_name || 'Book'}
                  className="h-16 w-16 flex-shrink-0 cursor-pointer rounded-[10px] object-cover"
                  onClick={() => navigate(`/listings/${listing?.id}`)} />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-[#1A1A1A]">{listing?.book_name}</h4>
                  <p className="text-xs text-[#8A8A8A]">{new Date(o.created_at).toLocaleDateString()}</p>
                <div className="mt-1">{statusLabel(o.status, subTab === 'selling')}</div>
                </div>
                {subTab === 'buying' && o.status === 'pending' && (
                  <GlassButton variant="destructive" className="flex-shrink-0 text-xs"
                    onClick={() => setConfirmCancel(o.id)}>Cancel</GlassButton>
                )}
                {(o.status === 'delivered' || o.status === 'cancelled') && (
                  <button
                    onClick={() => setConfirmHide(o.id)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-[#8A8A8A] transition-colors hover:bg-[rgba(232,53,122,0.06)] hover:text-[#E8357A]"
                    title="Remove from history"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {confirmCancel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirmCancel(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Cancel this order?</h3>
              <p className="mb-5 text-sm text-[#8A8A8A]">The listing will become available again.</p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setConfirmCancel(null)}>Keep Order</GlassButton>
                <GlassButton variant="destructive" className="flex-1" onClick={() => cancelOrder(confirmCancel)}>Cancel Order</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmHide && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirmHide(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Remove from order history?</h3>
              <p className="mb-5 text-sm text-[#8A8A8A]">This will only remove this order from your view. The order record will still be kept for platform records.</p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setConfirmHide(null)}>Cancel</GlassButton>
                <GlassButton variant="destructive" className="flex-1" onClick={() => hideOrder(confirmHide)}>Remove</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════ MY PROFILE ═══════════════ */
const MyProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useAppToast();
  const navigate = useNavigate();

  const [personalForm, setPersonalForm] = useState({ fullName: '', phone: '', district: '' });
  const [paymentNumber, setPaymentNumber] = useState('');
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setPersonalForm({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        district: profile.district || '',
      });
      setPaymentNumber(profile.bkash_nagad_number || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('wishlists')
      .select('*, listings(*)')
      .eq('user_id', user.id)
      .then(({ data }) => { setWishlist(data || []); setWishlistLoading(false); });
  }, [user]);

  const savePersonal = async () => {
    if (!user) return;
    setSavingPersonal(true);
    const { error } = await supabase.from('users').update({
      full_name: personalForm.fullName.trim(),
      phone: personalForm.phone.trim(),
      district: personalForm.district,
    }).eq('id', user.id);
    setSavingPersonal(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast('Profile updated', 'success');
    refreshProfile();
  };

  const savePayment = async () => {
    if (!user) return;
    setSavingPayment(true);
    const { error } = await supabase.from('users').update({
      bkash_nagad_number: paymentNumber.trim() || null,
    }).eq('id', user.id);
    setSavingPayment(false);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast('Payment info saved', 'success');
    refreshProfile();
  };

  const removeWishlistItem = async (wishlistId: string) => {
    await supabase.from('wishlists').delete().eq('id', wishlistId);
    setWishlist((prev) => prev.filter((w) => w.id !== wishlistId));
  };

  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-6">
      {/* Personal Info */}
      <div className="glass-panel p-6">
        <h3 className="mb-4 text-base font-bold text-[#1A1A1A]">Personal Info</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Full Name</label>
            <input value={personalForm.fullName} onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
              className={INPUT_CLASS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Phone Number</label>
            <input type="tel" value={personalForm.phone} onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
              className={INPUT_CLASS} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">District</label>
            <select value={personalForm.district} onChange={(e) => setPersonalForm({ ...personalForm, district: e.target.value })}
              className={`${INPUT_CLASS} appearance-none`}>
              <option value="">Select district</option>
              {BANGLADESH_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <GlassButton className="mt-1 w-full" onClick={savePersonal} disabled={savingPersonal}>
            {savingPersonal ? 'Saving...' : 'Save Changes'}
          </GlassButton>
        </div>
      </div>

      {/* Payment Info */}
      <div className="glass-panel p-6">
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Payment Info</h3>
        {profile?.bkash_nagad_number ? (
          <GlassBadge variant="new" className="mb-3">✓ Payment info saved</GlassBadge>
        ) : (
          <GlassBadge variant="fair" className="mb-3">⚠ Add payment info to start selling</GlassBadge>
        )}
        <div>
          <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">bKash / Nagad Number</label>
          <input type="tel" value={paymentNumber} onChange={(e) => setPaymentNumber(e.target.value)}
            className={INPUT_CLASS} placeholder="01XXXXXXXXX" />
          <p className="mt-1 text-xs text-[#8A8A8A]">Required before you can post a listing. This is where we'll send your payments.</p>
        </div>
        <GlassButton className="mt-3 w-full" onClick={savePayment} disabled={savingPayment}>
          {savingPayment ? 'Saving...' : 'Save Payment Info'}
        </GlassButton>
      </div>

      {/* Account Info */}
      <div className="glass-panel p-6">
        <h3 className="mb-3 text-base font-bold text-[#1A1A1A]">Account Info</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Email</span>
            <span className="text-[#3A3A3A]">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8A8A8A]">Member since</span>
            <span className="text-[#3A3A3A]">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#8A8A8A]">To change your email, contact support</p>
      </div>

      {/* Wishlist */}
      <div className="glass-panel p-6">
        <h3 className="mb-4 text-base font-bold text-[#1A1A1A]">Saved Books</h3>
        {wishlistLoading ? <SkeletonList count={2} /> : !wishlist.length ? (
          <div className="flex flex-col items-center py-6 text-center">
            <Heart size={32} className="mb-2 text-[#8A8A8A]" />
            <p className="text-sm text-[#8A8A8A]">No saved books yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wishlist.map((w) => {
              const l = w.listings;
              if (!l) return null;
              const isSold = l.status === 'sold';
              return (
                <div key={w.id} className="glass-panel-sm relative overflow-hidden p-2.5">
                  {isSold && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-2xl">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#3A3A3A]">Sold</span>
                    </div>
                  )}
                  <img src={l.photos?.[0] || '/placeholder.svg'} alt={l.book_name}
                    className="mb-2 aspect-[3/4] w-full rounded-lg object-cover" />
                  <h4 className="truncate text-xs font-bold text-[#1A1A1A]">{l.book_name}</h4>
                  <p className="text-xs font-bold text-[#E8357A]">{formatPrice(l.display_price)}</p>
                  <div className="mt-2 flex gap-1">
                    {!isSold && (
                      <GlassButton className="flex-1 py-1.5 text-[10px]" onClick={() => navigate(`/listings/${l.id}`)}>View</GlassButton>
                    )}
                    <button onClick={() => removeWishlistItem(w.id)}
                      className="rounded-lg p-1.5 text-[#8A8A8A] transition-colors hover:bg-[rgba(255,69,58,0.06)] hover:text-[#C0392B]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════ SHARED ═══════════════ */
const PillBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}
    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
      active ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]' : 'text-[#8A8A8A] hover:text-[#3A3A3A]'
    }`}>
    {children}
  </button>
);

const SkeletonList = ({ count }: { count: number }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-24 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />
    ))}
  </div>
);

export default Dashboard;

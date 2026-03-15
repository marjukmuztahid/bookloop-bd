import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Package } from 'lucide-react';
import { pageTransition } from '@/lib/animations';
import { calculateDeliveryCharge } from '@/lib/utils';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge, type BadgeVariant } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BANGLADESH_DISTRICTS } from '@/data/districts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const INPUT_CLASS =
  'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';

const conditionVariant = (c: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = { 'Like New': 'new', Good: 'good', Fair: 'fair', Worn: 'worn' };
  return map[c] || 'fair';
};

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const Checkout = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useAppToast();

  const [listing, setListing] = useState<any>(null);
  const [sellerDistrict, setSellerDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    district: '',
  });

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        district: profile.district || '',
      }));
    }
  }, [profile]);

  // Fetch listing + guards
  useEffect(() => {
    const init = async () => {
      if (!listingId || !user) return;

      const { data: listingData, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (error || !listingData) {
        showToast('Listing not found', 'error');
        navigate('/');
        return;
      }

      if (listingData.status !== 'available' || (listingData.quantity ?? 1) === 0) {
        showToast('Sorry, this book is no longer available', 'error');
        navigate(`/listings/${listingId}`);
        return;
      }

      if (listingData.seller_id === user.id) {
        showToast('You cannot order your own listing', 'error');
        navigate(`/listings/${listingId}`);
        return;
      }

      // Check existing pending order
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('listing_id', listingId)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingOrder) {
        showToast('You already have a pending order for this book', 'error');
        navigate(`/listings/${listingId}`);
        return;
      }

      // Get seller district
      const { data: sellerData } = await supabase
        .from('users')
        .select('district')
        .eq('id', listingData.seller_id)
        .single();

      setSellerDistrict(sellerData?.district || '');
      setListing(listingData);
      setLoading(false);
    };
    init();
  }, [listingId, user, navigate, showToast]);

  const deliveryCharge = useMemo(() => {
    if (!listing || !form.district || !sellerDistrict) return 0;
    return calculateDeliveryCharge(listing.weight_kg, sellerDistrict, form.district);
  }, [listing, form.district, sellerDistrict]);

  const totalAmount = listing ? listing.display_price + deliveryCharge : 0;

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.address.trim() || !form.district) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!user || !listing) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('orders').insert({
        buyer_id: user.id,
        listing_id: listing.id,
        delivery_address: form.address.trim(),
        delivery_phone: form.phone.trim(),
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        status: 'pending',
      });

      if (error) throw error;

      // Mark listing as unavailable via secure DB function
      await supabase.rpc('mark_listing_sold_pending', { p_listing_id: listing.id });

      setSuccess(true);
    } catch (err: any) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <SkeletonCheckout />;

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="glass-panel max-w-md p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(48,209,88,0.12)]"
            >
              <CheckCircle size={32} className="text-[#30D158]" />
            </motion.div>
            <h2 className="mb-2 text-xl font-bold text-[#1A1A1A]">Order Placed Successfully!</h2>
            <p className="mb-6 text-sm text-[#8A8A8A]">
              We'll review your order and notify you by email once it's approved. Get ready to pay{' '}
              <span className="font-semibold text-[#E8357A]">{formatPrice(totalAmount)}</span> to the Steadfast courier.
            </p>
            <div className="flex flex-col gap-2">
              <GlassButton className="w-full" onClick={() => navigate('/')}>Browse More Books</GlassButton>
              <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/dashboard')}>View My Orders</GlassButton>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) return null;

  const photo = listing.photos?.[0] || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main {...pageTransition} className="mx-auto max-w-5xl px-4 pb-16 pt-24">
        <h1 className="mb-6 text-2xl font-extrabold text-[#1A1A1A]">Checkout</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left — Order Summary */}
          <div className="glass-panel p-6">
            <h2 className="mb-4 text-base font-bold text-[#1A1A1A]">Order Summary</h2>

            <div className="mb-4 flex gap-3">
              <img src={photo} alt={listing.book_name} className="h-24 w-20 flex-shrink-0 rounded-[10px] object-cover" />
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">{listing.book_name}</h3>
                <GlassBadge variant={conditionVariant(listing.condition)} className="mt-1">{listing.condition}</GlassBadge>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Book price</span>
                <span className="text-[#3A3A3A]">{formatPrice(listing.display_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Delivery charge</span>
                <span className="text-[#3A3A3A]">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="my-2 h-px bg-[rgba(0,0,0,0.08)]" />
              <div className="flex justify-between">
                <span className="font-bold text-[#1A1A1A]">Total COD Amount</span>
                <span className="text-lg font-extrabold text-[#E8357A]">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#8A8A8A]">
              You will pay this amount in cash to the Steadfast courier upon delivery
            </p>
          </div>

          {/* Right — Delivery Form */}
          <div className="glass-panel p-6">
            <h2 className="mb-4 text-base font-bold text-[#1A1A1A]">Delivery Details</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Full Name</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={INPUT_CLASS} placeholder="Your full name" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Phone Number</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={INPUT_CLASS} placeholder="01XXXXXXXXX" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">Delivery Address</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`${INPUT_CLASS} min-h-[80px] resize-none`} placeholder="House/Road/Area details" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#3A3A3A]">District</label>
                <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className={`${INPUT_CLASS} appearance-none ${!form.district ? 'text-[#8A8A8A]' : ''}`}>
                  <option value="">Select district</option>
                  {BANGLADESH_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-[rgba(0,0,0,0.03)] p-3">
              <Package size={16} className="mt-0.5 flex-shrink-0 text-[#8A8A8A]" />
              <p className="text-xs text-[#8A8A8A]">
                Your order will be reviewed by our team before a pickup is scheduled. You'll be notified by email.
              </p>
            </div>

            <GlassButton
              className="mt-5 w-full py-3"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : `Confirm Order — Pay ${formatPrice(totalAmount)} on Delivery`}
            </GlassButton>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

const SkeletonCheckout = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-24">
      <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-[rgba(0,0,0,0.06)]" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-[rgba(0,0,0,0.06)]" />
        <div className="h-96 animate-pulse rounded-3xl bg-[rgba(0,0,0,0.06)]" />
      </div>
    </main>
    <Footer />
  </div>
);

export default Checkout;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Loader2 } from 'lucide-react';
import { pageTransition, fadeUp } from '@/lib/animations';
import { calculateDeliveryCharge } from '@/lib/utils';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge, type BadgeVariant } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const conditionVariant = (c: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = { 'Like New': 'new', Good: 'good', Fair: 'fair', Worn: 'worn' };
  return map[c] || 'fair';
};

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useAppToast();

  const [listing, setListing] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        setLoading(false);
        return;
      }
      setListing(data);

      // Fetch seller first name + district
      const { data: sellerData } = await supabase
        .from('users')
        .select('full_name, district')
        .eq('id', data.seller_id)
        .single();
      setSeller(sellerData);
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', id)
      .maybeSingle()
      .then(({ data }) => setWishlisted(!!data));
  }, [user, id]);

  const toggleWishlist = async () => {
    if (!user) {
      navigate(`/login?redirect=/listings/${id}`);
      return;
    }
    setWishlistLoading(true);
    const prev = wishlisted;
    setWishlisted(!prev); // optimistic

    if (prev) {
      const { error } = await supabase.from('wishlists').delete().eq('user_id', user.id).eq('listing_id', id!);
      if (error) { setWishlisted(prev); showToast('Failed to update wishlist', 'error'); }
    } else {
      const { error } = await supabase.from('wishlists').insert({ user_id: user.id, listing_id: id! });
      if (error) { setWishlisted(prev); showToast('Failed to update wishlist', 'error'); }
    }
    setWishlistLoading(false);
  };

  const handleOrder = () => {
    if (!user) {
      navigate(`/login?redirect=/listings/${id}`);
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const isAvailable = listing?.status === 'available';
  const isSoldPending = listing?.status === 'sold_pending_delivery';
  const isSold = listing?.status === 'sold';

  const deliveryCharge =
    listing && profile && seller
      ? calculateDeliveryCharge(listing.weight_kg, seller.district, profile.district)
      : null;

  if (loading) return <SkeletonDetail />;

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center pt-16">
          <div className="glass-panel max-w-sm p-8 text-center">
            <h2 className="mb-2 text-lg font-bold text-[#1A1A1A]">Listing not found</h2>
            <p className="mb-5 text-sm text-[#8A8A8A]">This listing may have been removed.</p>
            <GlassButton variant="secondary" onClick={() => navigate('/')}>Browse Books</GlassButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const photos: string[] = listing.photos?.length ? listing.photos : ['/placeholder.svg'];
  const sellerFirstName = seller?.full_name?.split(' ')[0] || 'Seller';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main {...pageTransition} className="mx-auto max-w-6xl px-4 pb-16 pt-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left — Photos */}
          <div>
            <div className="relative overflow-hidden rounded-[20px]" style={{ aspectRatio: '3/4' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhoto}
                  src={photos[activePhoto]}
                  alt={listing.book_name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-[#3A3A3A]">
                    {isSold ? 'Sold' : 'Unavailable'}
                  </span>
                </div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {photos.map((p: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-[10px] border-2 transition-all ${
                      i === activePhoto ? 'border-[#E8357A]' : 'border-transparent'
                    }`}
                  >
                    <img src={p} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] md:text-3xl">{listing.book_name}</h1>
            <p className="text-sm text-[#8A8A8A]">{listing.author_publisher}</p>

            <div className="flex flex-wrap gap-2">
              <GlassBadge variant="curriculum">{listing.curriculum}</GlassBadge>
              <GlassBadge variant={conditionVariant(listing.condition)}>{listing.condition}</GlassBadge>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-[#E8357A]">{formatPrice(listing.display_price)}</p>
              <p className="mt-0.5 text-xs text-[#8A8A8A]">Includes 5% platform fee</p>
            </div>

            {/* Delivery charge */}
            <div className="glass-panel-sm p-4">
              {user && profile && deliveryCharge !== null ? (
                <p className="text-sm text-[#3A3A3A]">
                  Delivery to {profile.district}: <span className="font-bold">{formatPrice(deliveryCharge)}</span>
                </p>
              ) : (
                <p className="text-sm text-[#8A8A8A]">
                  <Link to="/login" className="font-semibold text-[#E8357A]">Login</Link> to see delivery charge
                </p>
              )}
            </div>

            {/* Total estimate */}
            {deliveryCharge !== null && (
              <div className="glass-panel-sm p-4">
                <p className="text-sm text-[#8A8A8A]">
                  Estimated total (COD):{' '}
                  <span className="font-bold text-[#1A1A1A]">{formatPrice(listing.display_price + deliveryCharge)}</span>
                </p>
              </div>
            )}

            {/* Seller info */}
            {seller && (
              <div className="glass-panel-sm flex items-center gap-2 p-4">
                <MapPin size={14} className="text-[#8A8A8A]" />
                <p className="text-sm text-[#3A3A3A]">
                  Listed by <span className="font-semibold">{sellerFirstName}</span>, {seller.district}
                </p>
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="glass-panel-sm p-4">
                <p className="mb-1 text-xs font-semibold text-[#8A8A8A]">Seller's Note</p>
                <p className="text-sm text-[#3A3A3A]">{listing.description}</p>
              </div>
            )}

            {/* Action buttons */}
            {isAvailable ? (
              <div className="flex flex-col gap-2 pt-2">
                <GlassButton className="w-full py-3" onClick={handleOrder}>Order Now</GlassButton>
                <GlassButton
                  variant="secondary"
                  className={`w-full py-3 ${wishlisted ? 'bg-[rgba(232,53,122,0.08)]' : ''}`}
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                >
                  <Heart size={16} className={`mr-2 ${wishlisted ? 'fill-[#E8357A] text-[#E8357A]' : ''}`} />
                  {wishlisted ? 'Saved' : 'Save to Wishlist'}
                </GlassButton>
              </div>
            ) : (
              <div className="pt-2">
                <GlassBadge variant="worn" className="w-full justify-center py-3">
                  {isSold ? 'This book has been sold' : 'This listing is not available'}
                </GlassBadge>
              </div>
            )}
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

const SkeletonDetail = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="animate-pulse rounded-[20px] bg-[rgba(0,0,0,0.06)]" style={{ aspectRatio: '3/4' }} />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-[rgba(0,0,0,0.06)]" />
          <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[rgba(0,0,0,0.06)]" />
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-[rgba(0,0,0,0.06)]" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-[rgba(0,0,0,0.06)]" />
          </div>
          <div className="h-10 w-1/3 animate-pulse rounded-lg bg-[rgba(0,0,0,0.06)]" />
          <div className="h-16 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />
          <div className="h-16 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />
          <div className="h-12 animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]" />
          <div className="h-12 animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)]" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ListingDetail;

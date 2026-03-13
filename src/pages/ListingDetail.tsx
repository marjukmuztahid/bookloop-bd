import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Loader2, Share2 } from 'lucide-react';
import { pageTransition, fadeUp } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge, type BadgeVariant } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import useSEO from '@/hooks/useSEO';
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

  // Dynamic SEO
  const seoTitle = listing
    ? `${listing.book_name} — ${listing.curriculum} ${listing.class_level} | ${listing.condition} Condition | Book Loop BD`
    : 'Book Listing — Book Loop BD';
  const seoDesc = listing && seller
    ? `Buy ${listing.book_name} second hand in ${seller.district}, Bangladesh. ${listing.condition} condition. Cash on delivery via Steadfast Courier. Listed on Book Loop BD.`
    : 'View book listing on Book Loop BD.';
  const seoImage = listing?.photos?.[0] || undefined;

  useSEO({ title: seoTitle, description: seoDesc, ogImage: seoImage });

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
                  alt={`${listing.class_level} ${listing.book_name} ${listing.condition} condition — Book Loop BD`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full object-cover"
                  width={600}
                  height={800}
                  loading="eager"
                  fetchPriority="high"
                />
              </AnimatePresence>
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-bold text-[#3A3A3A]">
                    {isSoldPending ? 'Currently Unavailable' : isSold ? 'Sold' : 'Unavailable'}
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
                    <img src={p} alt="" className="h-full w-full object-cover" width={64} height={64} loading="lazy" />
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
              
            </div>

            {/* Delivery charge */}
            <div className="glass-panel-sm p-4">
              <p className="text-sm text-[#8A8A8A]">Delivery charge calculated at checkout</p>
            </div>

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

            {/* WhatsApp share */}
            {listing && (
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `Check out this book on Book Loop BD! ${listing.book_name} — ${listing.curriculum} ${listing.class_level}, ${listing.condition} condition. Price: ৳${listing.display_price.toLocaleString()}. Link: https://bookloopbd.com/listings/${listing.id}`
                  );
                  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[rgba(37,211,102,0.25)] bg-[rgba(37,211,102,0.08)] px-4 py-3 text-sm font-semibold text-[#25D366] backdrop-blur-sm transition-all hover:bg-[rgba(37,211,102,0.15)] active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Share on WhatsApp
              </button>
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
            ) : isSoldPending ? (
              <div className="flex flex-col gap-2 pt-2">
                <GlassButton className="w-full py-3" disabled>
                  Currently Unavailable
                </GlassButton>
                <p className="text-center text-xs text-[#8A8A8A]">This book has a pending order. Check back later — it may become available again.</p>
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

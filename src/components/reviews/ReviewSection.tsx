import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppToast } from '@/components/ui/GlassToast';
import { GlassButton } from '@/components/ui/GlassButton';

const Stars = ({ rating, size = 16, className = '' }: { rating: number; size?: number; className?: string }) => (
  <div className={`flex gap-0.5 ${className}`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={i <= Math.round(rating) ? 'fill-[#E8357A] text-[#E8357A]' : 'text-[#D0D0D0]'}
      />
    ))}
  </div>
);

const InteractiveStars = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={i <= (hover || value) ? 'fill-[#E8357A] text-[#E8357A]' : 'text-[#D0D0D0]'}
          />
        </button>
      ))}
    </div>
  );
};

export const ReviewSection = ({ listingId, sellerId }: { listingId: string; sellerId: string }) => {
  const { user } = useAuth();
  const { showToast } = useAppToast();

  const [avgRating, setAvgRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Rating input state
  const [canRate, setCanRate] = useState(false);
  const [existingRating, setExistingRating] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  // Fetch seller's global average rating
  useEffect(() => {
    if (!sellerId) return;
    supabase
      .from('seller_ratings')
      .select('rating')
      .eq('seller_id', sellerId)
      .then(({ data }) => {
        if (data?.length) {
          setTotalCount(data.length);
          setAvgRating(data.reduce((s: number, r: any) => s + r.rating, 0) / data.length);
        }
        setLoading(false);
      });
  }, [sellerId]);

  // Check eligibility & existing rating for this listing
  useEffect(() => {
    if (!user || !listingId) { setCanRate(false); return; }
    const check = async () => {
      // Check if buyer already rated this listing
      const { data: existing } = await supabase
        .from('seller_ratings')
        .select('rating')
        .eq('buyer_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();

      if (existing) {
        setExistingRating(existing.rating);
        setCanRate(false);
        return;
      }

      // Check if buyer has a delivered order for this listing
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('listing_id', listingId)
        .eq('status', 'delivered')
        .limit(1);

      setCanRate(!!orders?.length);
    };
    check();
  }, [user, listingId]);

  const handleSubmit = async () => {
    if (rating === 0) { setRatingError(true); return; }
    if (!user) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('seller_ratings')
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: sellerId,
        rating,
      } as any);

    setSubmitting(false);

    if (error) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }

    showToast('Rating submitted!', 'success');
    setExistingRating(rating);
    setCanRate(false);

    // Update displayed average
    const newTotal = totalCount + 1;
    const newAvg = (avgRating * totalCount + rating) / newTotal;
    setTotalCount(newTotal);
    setAvgRating(newAvg);
  };

  if (loading) {
    return (
      <div className="mt-8 space-y-3">
        <div className="h-6 w-48 animate-pulse rounded-lg bg-[rgba(0,0,0,0.06)]" />
        <div className="h-20 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6 h-px w-full bg-[rgba(0,0,0,0.06)]" />

      {/* Seller Average Rating */}
      <div className="glass-panel-sm mb-6 p-4">
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Seller Rating</h3>
        {totalCount > 0 ? (
          <div>
            <div className="flex items-center gap-3">
              <Stars rating={avgRating} size={18} />
              <span className="text-lg font-bold text-[#1A1A1A]">{avgRating.toFixed(1)} ★</span>
            </div>
            <p className="mt-1 text-sm text-[#8A8A8A]">Based on {totalCount} rating{totalCount !== 1 ? 's' : ''} across all listings</p>
          </div>
        ) : (
          <p className="text-sm text-[#8A8A8A]">No ratings yet</p>
        )}
      </div>

      {/* Existing rating display */}
      {existingRating !== null && (
        <div className="glass-panel-sm mb-6 p-4">
          <p className="mb-1 text-xs font-semibold text-[#8A8A8A]">You rated this</p>
          <Stars rating={existingRating} size={20} />
        </div>
      )}

      {/* Rate input */}
      {canRate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <h3 className="mb-1 text-base font-bold text-[#1A1A1A]">Rate your experience</h3>
          <p className="mb-4 text-sm text-[#8A8A8A]">How was your transaction with this seller?</p>

          <InteractiveStars value={rating} onChange={(v) => { setRating(v); setRatingError(false); }} />
          {ratingError && (
            <p className="mt-1 text-xs text-[#C0392B]">Please select a rating</p>
          )}

          <GlassButton className="mt-4 w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </GlassButton>
        </motion.div>
      )}
    </div>
  );
};

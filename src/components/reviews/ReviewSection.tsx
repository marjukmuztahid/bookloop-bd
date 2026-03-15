import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppToast } from '@/components/ui/GlassToast';
import { GlassButton } from '@/components/ui/GlassButton';

interface Review {
  id: string;
  order_id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  buyer_name?: string;
}

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'], [2592000, 'month'], [604800, 'week'],
    [86400, 'day'], [3600, 'hour'], [60, 'minute'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Write review state
  const [canReview, setCanReview] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  // Fetch all reviews for this seller
  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (data) {
        // Fetch buyer names
        const buyerIds = [...new Set(data.map((r: any) => r.buyer_id))];
        const { data: buyers } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', buyerIds);

        const buyerMap = new Map(buyers?.map((b: any) => [b.id, b.full_name?.split(' ')[0] || 'User']));

        setReviews(data.map((r: any) => ({
          ...r,
          buyer_name: buyerMap.get(r.buyer_id) || 'User',
        })));
      }
      setLoading(false);
    };
    fetchReviews();
  }, [sellerId]);

  // Check if current user can write a review
  useEffect(() => {
    if (!user || !listingId) { setCanReview(false); return; }
    const checkEligibility = async () => {
      // Find delivered order for this listing by this buyer
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('listing_id', listingId)
        .eq('status', 'delivered');

      if (!orders?.length) { setCanReview(false); return; }

      // Check if already reviewed any of these orders
      const orderIds = orders.map((o: any) => o.id);
      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('id')
        .in('order_id', orderIds);

      if (existingReviews?.length) { setCanReview(false); return; }

      setCanReview(true);
      setEligibleOrderId(orderIds[0]);
    };
    checkEligibility();
  }, [user, listingId]);

  const handleSubmit = async () => {
    if (rating === 0) { setRatingError(true); return; }
    if (!eligibleOrderId) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        order_id: eligibleOrderId,
        listing_id: listingId,
        buyer_id: user!.id,
        seller_id: sellerId,
        rating,
        comment: comment.trim() || null,
      } as any)
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      showToast('Something went wrong. Please try again.', 'error');
      return;
    }

    showToast('Review submitted!', 'success');
    setCanReview(false);

    // Get buyer name for display
    const buyerName = user?.user_metadata?.full_name?.split(' ')[0] || 'You';
    setReviews((prev) => [{
      ...(data as any),
      buyer_name: buyerName,
    }, ...prev]);
  };

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

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

      {/* Part A — Rating Summary */}
      <div className="glass-panel-sm mb-6 p-4">
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Seller Rating</h3>
        {reviews.length > 0 ? (
          <div className="flex items-center gap-3">
            <Stars rating={avgRating} size={18} />
            <span className="text-lg font-bold text-[#1A1A1A]">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-[#8A8A8A]">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </div>
        ) : (
          <p className="text-sm text-[#8A8A8A]">No reviews yet</p>
        )}
      </div>

      {/* Part B — Reviews List */}
      {reviews.length > 0 ? (
        <div className="flex flex-col gap-3">
          {displayedReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="glass-panel-sm p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8357A] text-xs font-bold text-white">
                    {review.buyer_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{review.buyer_name}</p>
                    <Stars rating={review.rating} size={12} />
                  </div>
                </div>
                <span className="text-xs text-[#8A8A8A]">{timeAgo(review.created_at)}</span>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-[#3A3A3A]">{review.comment}</p>
              )}
            </motion.div>
          ))}
          {reviews.length > 5 && !showAll && (
            <GlassButton variant="secondary" className="w-full text-sm" onClick={() => setShowAll(true)}>
              Show all reviews
            </GlassButton>
          )}
        </div>
      ) : (
        <div className="glass-panel-sm flex flex-col items-center py-8 text-center">
          <MessageSquare size={32} className="mb-2 text-[#8A8A8A]" />
          <p className="text-sm text-[#8A8A8A]">Be the first to review this seller</p>
        </div>
      )}

      {/* Part C — Write a Review */}
      {canReview && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mt-6 p-6"
        >
          <h3 className="mb-1 text-base font-bold text-[#1A1A1A]">Rate your experience</h3>
          <p className="mb-4 text-sm text-[#8A8A8A]">How was your transaction with this seller?</p>

          <InteractiveStars value={rating} onChange={(v) => { setRating(v); setRatingError(false); }} />
          {ratingError && (
            <p className="mt-1 text-xs text-[#C0392B]">Please select a rating</p>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder="Share details about your experience (optional)"
            className="mt-4 w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]"
            rows={3}
            maxLength={500}
          />
          <p className="mt-1 text-right text-xs text-[#8A8A8A]">{comment.length}/500</p>

          <GlassButton className="mt-3 w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </GlassButton>
        </motion.div>
      )}
    </div>
  );
};

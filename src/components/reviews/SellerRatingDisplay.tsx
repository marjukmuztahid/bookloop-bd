import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SellerRatingDisplay = ({ sellerId }: { sellerId: string }) => {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    supabase
      .from('seller_ratings')
      .select('rating')
      .eq('seller_id', sellerId)
      .then(({ data }) => {
        if (data?.length) {
          setCount(data.length);
          setAvg(data.reduce((s: number, r: any) => s + r.rating, 0) / data.length);
        }
        setLoading(false);
      });
  }, [sellerId]);

  if (loading) return null;
  if (!count) return <p className="text-xs text-[#8A8A8A]">No ratings yet</p>;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={14} className={i <= Math.round(avg) ? 'fill-[#E8357A] text-[#E8357A]' : 'text-[#D0D0D0]'} />
        ))}
      </div>
      <span className="text-sm font-bold text-[#1A1A1A]">{avg.toFixed(1)}</span>
      <span className="text-xs text-[#8A8A8A]">({count} rating{count !== 1 ? 's' : ''})</span>
    </div>
  );
};

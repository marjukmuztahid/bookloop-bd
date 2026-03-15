import { useState, useEffect, useCallback } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAppToast } from '@/components/ui/GlassToast';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import AdminLayout from '@/components/admin/AdminLayout';

interface ReviewRow {
  id: string;
  order_id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  listing_title?: string;
  buyer_name?: string;
  seller_name?: string;
}

const AdminReviews = () => {
  const { showToast } = useAppToast();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!data) { setLoading(false); return; }

    // Gather unique IDs
    const listingIds = [...new Set(data.map((r: any) => r.listing_id))];
    const userIds = [...new Set(data.flatMap((r: any) => [r.buyer_id, r.seller_id]))];

    const [{ data: listings }, { data: users }] = await Promise.all([
      supabase.from('listings').select('id, book_name').in('id', listingIds),
      supabase.from('users').select('id, full_name').in('id', userIds),
    ]);

    const listingMap = new Map(listings?.map((l: any) => [l.id, l.book_name]));
    const userMap = new Map(users?.map((u: any) => [u.id, u.full_name]));

    setReviews(data.map((r: any) => ({
      ...r,
      listing_title: listingMap.get(r.listing_id) || 'Deleted listing',
      buyer_name: userMap.get(r.buyer_id) || 'Unknown',
      seller_name: userMap.get(r.seller_id) || 'Unknown',
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) { showToast('Failed to delete review', 'error'); return; }
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete(null);
    showToast('Review deleted', 'success');
  };

  return (
    <AdminLayout title="Reviews">
      <div className="mb-4">
        <GlassBadge variant="curriculum">{reviews.length} total reviews</GlassBadge>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-[rgba(0,0,0,0.06)]" />
          ))}
        </div>
      ) : !reviews.length ? (
        <div className="glass-panel flex flex-col items-center p-10 text-center">
          <Star size={40} className="mb-3 text-[#8A8A8A]" />
          <h3 className="text-base font-bold text-[#1A1A1A]">No reviews yet</h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.06)] text-xs text-[#8A8A8A]">
                <th className="pb-2 pr-3 font-medium">Listing</th>
                <th className="pb-2 pr-3 font-medium">Buyer</th>
                <th className="pb-2 pr-3 font-medium">Seller</th>
                <th className="pb-2 pr-3 font-medium">Rating</th>
                <th className="pb-2 pr-3 font-medium">Comment</th>
                <th className="pb-2 pr-3 font-medium">Date</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-[rgba(0,0,0,0.04)]">
                  <td className="max-w-[140px] truncate py-3 pr-3 font-medium text-[#1A1A1A]">{r.listing_title}</td>
                  <td className="py-3 pr-3 text-[#3A3A3A]">{r.buyer_name}</td>
                  <td className="py-3 pr-3 text-[#3A3A3A]">{r.seller_name}</td>
                  <td className="py-3 pr-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={12} className={i <= r.rating ? 'fill-[#E8357A] text-[#E8357A]' : 'text-[#D0D0D0]'} />
                      ))}
                    </div>
                  </td>
                  <td className="max-w-[180px] py-3 pr-3" title={r.comment || ''}>
                    <span className="truncate text-[#3A3A3A]">
                      {r.comment ? (r.comment.length > 60 ? r.comment.slice(0, 60) + '…' : r.comment) : '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-[#8A8A8A]">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <GlassButton variant="destructive" className="py-1 text-xs" onClick={() => setConfirmDelete(r.id)}>
                      <Trash2 size={12} className="mr-1" /> Delete
                    </GlassButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-panel max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Delete this review?</h3>
              <p className="mb-5 text-sm text-[#8A8A8A]">This cannot be undone.</p>
              <div className="flex gap-2">
                <GlassButton variant="secondary" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</GlassButton>
                <GlassButton variant="destructive" className="flex-1" onClick={() => deleteReview(confirmDelete)}>Delete</GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminReviews;

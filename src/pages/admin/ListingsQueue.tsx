import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Pencil } from 'lucide-react';

import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useAppToast } from '@/components/ui/GlassToast';
import { supabase } from '@/integrations/supabase/client';
import { logActivity, notifyUser } from '@/hooks/useAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import { GENRES } from '@/data/genres';
import type { BookCondition, Curriculum, BookType, Genre } from '@/types';

const CURRICULUMS: Array<{ label: string; value: Curriculum }> = [
  { label: 'Bangla Version', value: 'bangla_version' },
  { label: 'English Version', value: 'english_version' },
  { label: 'English Medium', value: 'english_medium' },
  { label: 'University', value: 'university' },
  { label: 'Test Prep', value: 'test_prep' },
];
const SCHOOL_COLLEGE_LEVELS = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','SSC','HSC','O-Level','A-Level'];
const CLASS_LEVELS_BY_CURRICULUM: Record<Curriculum, string[]> = {
  bangla_version: SCHOOL_COLLEGE_LEVELS,
  english_version: SCHOOL_COLLEGE_LEVELS,
  english_medium: SCHOOL_COLLEGE_LEVELS,
  university: ['Bachelors', 'Masters'],
  test_prep: ['IELTS', 'TOEFL', 'GRE', 'SAT'],
};
const CONDITIONS: BookCondition[] = ['new', 'good', 'fair', 'worn'];

const INPUT_CLASS = 'w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-4 py-3 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]';
const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const ListingsQueue = () => {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [typeFilter, setTypeFilter] = useState<'all' | 'academic' | 'general'>('all');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string; sellerId: string } | null>(null);
  const [removeModal, setRemoveModal] = useState<{ id: string; name: string; sellerId: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [detailListing, setDetailListing] = useState<any | null>(null);
  const [detailSeller, setDetailSeller] = useState<any | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const openDetail = async (l: any) => {
    setDetailListing(l);
    setPhotoIdx(0);
    setDetailSeller(null);
    setEditMode(false);
    setEditForm(null);
    const { data } = await supabase.from('users').select('full_name, district, phone, detailed_address, bkash_nagad_number, payment_method').eq('id', l.seller_id).maybeSingle();
    setDetailSeller(data);
  };
  const closeDetail = () => { setDetailListing(null); setDetailSeller(null); setEditMode(false); setEditForm(null); };

  const startEdit = () => {
    if (!detailListing) return;
    const l = detailListing;
    setEditForm({
      book_type: l.book_type || 'academic',
      book_name: l.book_name || '',
      author_publisher: l.author_publisher || '',
      curriculum: l.curriculum || '',
      class_level: l.class_level || '',
      genre: l.genre || '',
      condition: l.condition || 'good',
      weight_kg: String(l.weight_kg ?? ''),
      quantity: l.quantity ?? 1,
      seller_price: String(l.seller_price ?? ''),
      description: l.description || '',
    });
    setEditMode(true);
  };

  const saveEdit = async () => {
    if (!detailListing || !editForm) return;
    const f = editForm;
    if (!f.book_name.trim()) { showToast('Book name is required', 'error'); return; }
    if (!f.author_publisher.trim()) { showToast('Author/Publisher is required', 'error'); return; }
    const weight = parseFloat(f.weight_kg);
    const price = parseFloat(f.seller_price);
    const qty = parseInt(String(f.quantity), 10);
    if (isNaN(weight) || weight <= 0) { showToast('Valid weight required', 'error'); return; }
    if (isNaN(price) || price <= 0) { showToast('Valid seller price required', 'error'); return; }
    if (isNaN(qty) || qty < 1 || qty > 50) { showToast('Quantity must be 1–50', 'error'); return; }
    if (f.book_type === 'academic') {
      if (!f.curriculum) { showToast('Select a curriculum', 'error'); return; }
      if (!f.class_level) { showToast('Select a class level', 'error'); return; }
    } else {
      if (!f.genre) { showToast('Select a genre', 'error'); return; }
    }

    const payload: any = {
      book_type: f.book_type,
      book_name: f.book_name.trim(),
      author_publisher: f.author_publisher.trim(),
      condition: f.condition,
      weight_kg: weight,
      quantity: qty,
      seller_price: price,
      description: f.description.trim() || null,
    };
    if (f.book_type === 'academic') {
      payload.curriculum = f.curriculum;
      payload.class_level = f.class_level;
      payload.genre = null;
    } else {
      payload.genre = f.genre;
      payload.curriculum = null;
      payload.class_level = null;
    }

    setSavingEdit(true);
    const { data, error } = await supabase.from('listings').update(payload).eq('id', detailListing.id).select('*').maybeSingle();
    setSavingEdit(false);
    if (error) { showToast(`Failed to save: ${error.message}`, 'error'); return; }

    await logActivity('listing_edited', `Listing "${payload.book_name}" edited by admin`);
    await notifyUser(detailListing.seller_id, `Your listing "${payload.book_name}" was updated by the admin.`);
    showToast('Listing updated', 'success');
    setEditMode(false);
    setEditForm(null);
    if (data) setDetailListing({ ...detailListing, ...data });
    fetch();
  };


  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('listings').select('*, users!listings_seller_id_fkey(full_name, district)').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    if (typeFilter !== 'all') q = q.eq('book_type', typeFilter);
    if (search.trim()) q = q.ilike('book_name', `%${search.trim()}%`);
    const { data } = await q;
    setListings(data || []);
    setLoading(false);
  }, [filter, typeFilter, search]);

  useEffect(() => { fetch(); }, [fetch]);

  const approve = async (l: any) => {
    await supabase.from('listings').update({ status: 'available' }).eq('id', l.id);
    await logActivity('listing_approved', `Listing "${l.book_name}" approved`);
    await notifyUser(l.seller_id, `Your listing for "${l.book_name}" has been approved and is now live!`);
    showToast('Listing approved', 'success');
    fetch();
  };

  const confirmReject = async () => {
    if (!rejectModal || !rejectReason.trim()) { showToast('Please provide a reason', 'error'); return; }
    await supabase.from('listings').update({ status: 'rejected', rejection_reason: rejectReason.trim() } as any).eq('id', rejectModal.id);
    await logActivity('listing_rejected', `Listing "${rejectModal.name}" rejected`);
    await notifyUser(rejectModal.sellerId, `Your listing for "${rejectModal.name}" was not approved. Reason: ${rejectReason.trim()}`);
    showToast('Listing rejected', 'success');
    setRejectModal(null);
    setRejectReason('');
    fetch();
  };

  const confirmRemove = async () => {
    if (!removeModal) return;
    await supabase.from('listings').update({ status: 'deleted' } as any).eq('id', removeModal.id);
    await logActivity('listing_removed', `Listing "${removeModal.name}" removed by admin`);
    await notifyUser(removeModal.sellerId, `Your listing for "${removeModal.name}" has been removed by the admin.`);
    showToast('Listing removed', 'success');
    setRemoveModal(null);
    fetch();
  };

  const confirmPermanentDelete = async () => {
    if (!deleteModal) return;
    // Remove related records first to avoid FK constraint issues
    await supabase.from('wishlists').delete().eq('listing_id', deleteModal.id);
    await supabase.from('orders').delete().eq('listing_id', deleteModal.id);
    const { error } = await supabase.from('listings').delete().eq('id', deleteModal.id);
    if (error) {
      showToast(`Failed to delete: ${error.message}`, 'error');
      return;
    }
    await logActivity('listing_permanently_deleted', `Listing "${deleteModal.name}" permanently deleted by admin`);
    showToast('Listing permanently deleted', 'success');
    setDeleteModal(null);
    fetch();
  };

  const statusBadge = (s: string) => {
    const map: Record<string, any> = { pending: ['Pending', 'good'], available: ['Available', 'new'], rejected: ['Rejected', 'fair'], sold: ['Sold', 'worn'], sold_pending_delivery: ['Order in Progress', 'fair'], deleted: ['Deleted by Seller', 'worn'], expired: ['Expired', 'worn'] };
    const [label, variant] = map[s] || [s, 'worn'];
    return <GlassBadge variant={variant}>{label}</GlassBadge>;
  };

  return (
    <AdminLayout title="Listings Queue">
      {/* Type filter */}
      <div className="mb-2 flex flex-wrap gap-2">
        {(['all', 'academic', 'general'] as const).map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${typeFilter === t ? 'bg-[rgba(139,92,246,0.12)] text-[#6D28D9]' : 'bg-[rgba(0,0,0,0.04)] text-[#8A8A8A]'}`}>
            {t === 'all' ? 'All Types' : t === 'academic' ? 'Academic' : 'General'}
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'pending', 'available', 'rejected', 'sold', 'deleted', 'expired'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${filter === f ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]' : 'bg-[rgba(0,0,0,0.04)] text-[#8A8A8A]'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search book name"
            className={`${INPUT_CLASS} py-1.5 pl-8 text-xs`} />
        </div>
      </div>

      {loading ? <SkeletonRows /> : !listings.length ? (
        <p className="py-10 text-center text-sm text-[#8A8A8A]">No listings found</p>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((l) => (
            <div key={l.id} onClick={() => openDetail(l)}
              className="glass-panel-sm flex flex-wrap items-center gap-3 p-3 cursor-pointer transition hover:bg-[rgba(232,53,122,0.04)]">
              <img src={l.photos?.[0] || '/placeholder.svg'} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <GlassBadge variant={l.book_type === 'general' ? 'general' : 'academic'} className="text-[10px]">
                    {l.book_type === 'general' ? 'General' : 'Academic'}
                  </GlassBadge>
                  <h4 className="truncate text-sm font-bold text-[#1A1A1A]">{l.book_name}</h4>
                </div>
                <p className="text-xs text-[#8A8A8A]">{l.author_publisher} • {l.users?.full_name}, {l.users?.district}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {l.book_type === 'general' ? (
                    l.genre && <GlassBadge variant="genre" className="text-[10px]">{l.genre}</GlassBadge>
                  ) : (
                    <>
                      {l.curriculum && <GlassBadge variant="curriculum" className="text-[10px]">{l.curriculum}</GlassBadge>}
                      {l.class_level && <GlassBadge variant="worn" className="text-[10px]">{l.class_level}</GlassBadge>}
                    </>
                  )}
                  <span className="text-xs font-bold text-[#E8357A]">{formatPrice(l.display_price)}</span>
                  <span className="text-[10px] text-[#8A8A8A]">Qty: {l.quantity ?? 1}</span>
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                {statusBadge(l.status)}
                <p className="text-[10px] text-[#8A8A8A]">{new Date(l.created_at).toLocaleDateString()}</p>
                {l.status === 'pending' && (
                  <div className="flex gap-1.5">
                    <GlassButton variant="success" className="py-1 text-[10px]" onClick={() => approve(l)}>Approve</GlassButton>
                    <GlassButton variant="destructive" className="py-1 text-[10px]"
                      onClick={() => setRejectModal({ id: l.id, name: l.book_name, sellerId: l.seller_id })}>Reject</GlassButton>
                  </div>
                )}
                {l.status === 'available' && (
                  <GlassButton variant="destructive" className="py-1 text-[10px]"
                    onClick={() => setRemoveModal({ id: l.id, name: l.book_name, sellerId: l.seller_id })}>Remove</GlassButton>
                )}
                {['sold', 'deleted', 'rejected', 'expired'].includes(l.status) && (
                  <GlassButton variant="destructive" className="py-1 text-[10px]"
                    onClick={() => setDeleteModal({ id: l.id, name: l.book_name })}>Delete Permanently</GlassButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }}>
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Reject Listing</h3>
        <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
          className={`${INPUT_CLASS} min-h-[80px] resize-none`} placeholder="Reason for rejection" />
        <div className="mt-4 flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</GlassButton>
          <GlassButton variant="destructive" className="flex-1" onClick={confirmReject}>Confirm Rejection</GlassButton>
        </div>
      </Modal>

      {/* Remove Modal */}
      <Modal open={!!removeModal} onClose={() => setRemoveModal(null)}>
        <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">Remove Listing?</h3>
        <p className="mb-4 text-sm text-[#8A8A8A]">This will remove the listing and notify the seller.</p>
        <div className="flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => setRemoveModal(null)}>Cancel</GlassButton>
          <GlassButton variant="destructive" className="flex-1" onClick={confirmRemove}>Remove</GlassButton>
        </div>
      </Modal>

      {/* Permanent Delete Modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)}>
        <h3 className="mb-2 text-base font-bold text-[#E8357A]">⚠️ Permanently Delete?</h3>
        <p className="mb-4 text-sm text-[#3A3A3A]">This will permanently remove <strong>{deleteModal?.name}</strong> from the database. This action cannot be undone.</p>
        <div className="flex gap-2">
          <GlassButton variant="secondary" className="flex-1" onClick={() => setDeleteModal(null)}>Cancel</GlassButton>
          <GlassButton variant="destructive" className="flex-1" onClick={confirmPermanentDelete}>Delete Forever</GlassButton>
        </div>
      </Modal>

      {/* Full Detail Modal */}
      <Modal open={!!detailListing} onClose={closeDetail} panelClassName="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        {detailListing && (() => {
          const l = detailListing;
          const photos: string[] = l.photos?.length ? l.photos : ['/placeholder.svg'];
          const sellerPrice = Number(l.seller_price) || 0;
          const fee = Math.round(sellerPrice * 0.10);
          return (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <GlassBadge variant={l.book_type === 'general' ? 'general' : 'academic'} className="text-[10px]">
                      {l.book_type === 'general' ? 'General' : 'Academic'}
                    </GlassBadge>
                    {statusBadge(l.status)}
                  </div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">{l.book_name}</h2>
                  <p className="text-xs text-[#8A8A8A]">{l.author_publisher}</p>
                </div>
                <button onClick={closeDetail} className="text-xs text-[#8A8A8A] hover:text-[#1A1A1A]">✕</button>
              </div>

              {/* Photo gallery */}
              <div className="relative">
                <img src={photos[photoIdx]} alt={`${l.book_name} photo ${photoIdx + 1}`}
                  className="h-72 w-full rounded-xl object-contain bg-[rgba(0,0,0,0.04)]" />
                {photos.length > 1 && (
                  <>
                    <button onClick={() => setPhotoIdx((p) => (p - 1 + photos.length) % photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow"><ChevronLeft size={18} /></button>
                    <button onClick={() => setPhotoIdx((p) => (p + 1) % photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow"><ChevronRight size={18} /></button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                      {photoIdx + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {photos.map((p, i) => (
                    <img key={i} src={p} alt="" onClick={() => setPhotoIdx(i)}
                      className={`h-14 w-14 flex-shrink-0 cursor-pointer rounded-lg object-cover border-2 ${i === photoIdx ? 'border-[#E8357A]' : 'border-transparent'}`} />
                  ))}
                </div>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                {l.book_type === 'general' && l.genre && <Field label="Genre" value={l.genre} />}
                {l.book_type !== 'general' && l.curriculum && <Field label="Curriculum" value={l.curriculum} />}
                {l.book_type !== 'general' && l.class_level && <Field label="Class Level" value={l.class_level} />}
                <Field label="Condition" value={l.condition} />
                <Field label="Weight" value={`${l.weight_kg} kg`} />
                <Field label="Quantity" value={String(l.quantity ?? 1)} />
                <Field label="Seller Price" value={formatPrice(sellerPrice)} />
                <Field label="Platform Fee (10%)" value={formatPrice(fee)} />
                <Field label="Display Price" value={formatPrice(l.display_price)} />
                <Field label="Created" value={new Date(l.created_at).toLocaleString()} />
                <Field label="Expires" value={new Date(l.expires_at).toLocaleString()} />
              </div>

              {/* Seller note */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8A8A8A]">Seller's Note</p>
                <p className="whitespace-pre-wrap rounded-xl bg-[rgba(0,0,0,0.04)] p-3 text-sm text-[#3A3A3A]">
                  {l.description?.trim() || <span className="text-[#8A8A8A]">No description provided.</span>}
                </p>
              </div>

              {l.rejection_reason && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#E8357A]">Rejection Reason</p>
                  <p className="rounded-xl bg-[rgba(232,53,122,0.08)] p-3 text-sm text-[#3A3A3A]">{l.rejection_reason}</p>
                </div>
              )}

              {/* Seller info */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8A8A8A]">Seller</p>
                {detailSeller ? (
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-[rgba(0,0,0,0.04)] p-3 text-sm md:grid-cols-3">
                    <Field label="Name" value={detailSeller.full_name} />
                    <Field label="District" value={detailSeller.district} />
                    <Field label="Phone" value={detailSeller.phone || '—'} />
                    <Field label="Address" value={detailSeller.detailed_address || '—'} />
                    <Field label="bKash/Nagad" value={detailSeller.bkash_nagad_number || '—'} />
                    <Field label="Payment Method" value={detailSeller.payment_method || '—'} />
                  </div>
                ) : (
                  <p className="text-xs text-[#8A8A8A]">Loading seller info...</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-2 border-t border-[rgba(0,0,0,0.08)] pt-4">
                <GlassButton variant="secondary" onClick={closeDetail}>Close</GlassButton>
                {l.status === 'pending' && (
                  <>
                    <GlassButton variant="success" onClick={() => { approve(l); closeDetail(); }}>Approve</GlassButton>
                    <GlassButton variant="destructive" onClick={() => { setRejectModal({ id: l.id, name: l.book_name, sellerId: l.seller_id }); closeDetail(); }}>Reject</GlassButton>
                  </>
                )}
                {l.status === 'available' && (
                  <GlassButton variant="destructive" onClick={() => { setRemoveModal({ id: l.id, name: l.book_name, sellerId: l.seller_id }); closeDetail(); }}>Remove</GlassButton>
                )}
                {['sold', 'deleted', 'rejected', 'expired'].includes(l.status) && (
                  <GlassButton variant="destructive" onClick={() => { setDeleteModal({ id: l.id, name: l.book_name }); closeDetail(); }}>Delete Permanently</GlassButton>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </AdminLayout>
  );
};

const Modal = ({ open, onClose, children, panelClassName }: { open: boolean; onClose: () => void; children: React.ReactNode; panelClassName?: string }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className={panelClassName || 'glass-panel max-w-sm w-full p-6'} onClick={(e) => e.stopPropagation()}>
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

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8A8A8A]">{label}</p>
    <p className="text-sm text-[#1A1A1A] break-words">{value}</p>
  </div>
);

export default ListingsQueue;

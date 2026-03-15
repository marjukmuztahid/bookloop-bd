import { useState, useEffect, useMemo } from 'react';
import { Search, Package, PackageX } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { supabase } from '@/integrations/supabase/client';
import { calculatePlatformFee } from '@/lib/utils';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const PAGE_SIZE = 20;

interface OrderRecord {
  id: string;
  status: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_charge: number;
  total_amount: number;
  updated_at: string;
  listing: {
    book_name: string;
    seller_price: number;
    display_price: number;
    seller: {
      full_name: string;
      phone: string;
      district: string;
    };
  };
  buyer: {
    full_name: string;
    phone: string;
    district: string;
  };
}

const OrderHistory = () => {
  useDocumentTitle('Order History — Admin');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [successSearch, setSuccessSearch] = useState('');
  const [failSearch, setFailSearch] = useState('');
  const [successPage, setSuccessPage] = useState(1);
  const [failPage, setFailPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, delivery_address, delivery_phone, delivery_charge, total_amount, updated_at,
          listing:listings!orders_listing_id_fkey (
            book_name, seller_price, display_price,
            seller:users!listings_seller_id_fkey ( full_name, phone, district )
          ),
          buyer:users!orders_buyer_id_fkey ( full_name, phone, district )
        `)
        .in('status', ['delivered', 'unsuccessful'])
        .order('updated_at', { ascending: false });

      if (!error && data) {
        const mapped = (data as any[]).map((o) => ({
          ...o,
          listing: Array.isArray(o.listing) ? o.listing[0] : o.listing,
          buyer: Array.isArray(o.buyer) ? o.buyer[0] : o.buyer,
        })) as OrderRecord[];
        setOrders(mapped);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filterOrders = (list: OrderRecord[], search: string) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (o) =>
        o.listing?.book_name?.toLowerCase().includes(q) ||
        o.listing?.seller?.full_name?.toLowerCase().includes(q) ||
        o.buyer?.full_name?.toLowerCase().includes(q)
    );
  };

  const successful = useMemo(() => orders.filter((o) => o.status === 'delivered'), [orders]);
  const unsuccessful = useMemo(() => orders.filter((o) => o.status === 'unsuccessful'), [orders]);

  const filteredSuccess = useMemo(() => filterOrders(successful, successSearch), [successful, successSearch]);
  const filteredFail = useMemo(() => filterOrders(unsuccessful, failSearch), [unsuccessful, failSearch]);

  const paginate = (list: OrderRecord[], page: number) => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = (list: OrderRecord[]) => Math.max(1, Math.ceil(list.length / PAGE_SIZE));

  const OrderRow = ({ order, variant }: { order: OrderRecord; variant: 'success' | 'fail' }) => {
    const fee = calculatePlatformFee(order.listing?.seller_price ?? 0);
    return (
      <div className="border-b border-[rgba(0,0,0,0.04)] px-4 py-4 last:border-b-0 sm:px-5">
        {/* Book info + badge */}
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">{order.listing?.book_name ?? 'Unknown Book'}</p>
            <p className="mt-0.5 text-xs text-[#8A8A8A]">
              Listed ৳{order.listing?.seller_price ?? '–'} · Buyer ৳{order.listing?.display_price ?? '–'} · Fee ৳{fee}
            </p>
          </div>
          {variant === 'success' ? (
            <GlassBadge variant="new">Delivered</GlassBadge>
          ) : (
            <GlassBadge variant="worn" className="bg-[rgba(255,59,48,0.10)] border-[rgba(255,59,48,0.25)] text-[#D32F2F]">
              Unsuccessful
            </GlassBadge>
          )}
        </div>

        {/* Seller / Buyer grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#8A8A8A]">Seller</p>
            <p className="text-xs text-[#3A3A3A]">{order.listing?.seller?.full_name ?? '–'}</p>
            <p className="text-xs text-[#8A8A8A]">{order.listing?.seller?.phone ?? '–'}</p>
            <p className="text-xs text-[#8A8A8A]">{order.listing?.seller?.district ?? '–'}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#8A8A8A]">Buyer</p>
            <p className="text-xs text-[#3A3A3A]">{order.buyer?.full_name ?? '–'}</p>
            <p className="text-xs text-[#8A8A8A]">{order.buyer?.phone ?? '–'} · {order.buyer?.district ?? '–'}</p>
            <p className="text-xs text-[#8A8A8A]">{order.delivery_address}</p>
          </div>
        </div>

        {/* Date */}
        <p className="mt-2 text-[11px] text-[#8A8A8A]">
          {variant === 'success' ? 'Delivered' : 'Marked unsuccessful'}{' '}
          {order.updated_at ? new Date(order.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '–'}
        </p>
      </div>
    );
  };

  const PaginationControls = ({
    page,
    total,
    setPage,
  }: {
    page: number;
    total: number;
    setPage: (p: number) => void;
  }) =>
    total <= 1 ? null : (
      <div className="flex items-center justify-center gap-2 py-3">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#3A3A3A] transition-colors hover:bg-[rgba(0,0,0,0.04)] disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-xs text-[#8A8A8A]">
          {page} / {total}
        </span>
        <button
          onClick={() => setPage(Math.min(total, page + 1))}
          disabled={page === total}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#3A3A3A] transition-colors hover:bg-[rgba(0,0,0,0.04)] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );

  const SearchBar = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="relative mb-3">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by book, seller, or buyer name…"
        className="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.6)] py-2 pl-9 pr-3 text-xs text-[#3A3A3A] outline-none placeholder:text-[#AAAAAA] focus:border-[#E8357A]/40 focus:ring-1 focus:ring-[#E8357A]/20"
      />
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package size={36} className="mb-3 text-[#CCCCCC]" />
      <p className="text-sm text-[#8A8A8A]">{message}</p>
    </div>
  );

  const SkeletonRows = () => (
    <div className="space-y-4 px-4 py-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-4 w-2/3 rounded bg-[rgba(0,0,0,0.06)]" />
          <div className="h-3 w-1/2 rounded bg-[rgba(0,0,0,0.04)]" />
          <div className="h-3 w-1/3 rounded bg-[rgba(0,0,0,0.04)]" />
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout title="Order History">
      <p className="mb-6 text-sm text-[#8A8A8A]">A permanent record of all completed and unsuccessful deliveries.</p>

      {/* ✅ Successful Deliveries */}
      <GlassPanel className="mb-6">
        <div className="flex flex-wrap items-center gap-2 px-4 pt-4 sm:px-5">
          <h3 className="text-sm font-bold text-[#1A1A1A]">✅ Successful Deliveries</h3>
          <GlassBadge variant="new">{filteredSuccess.length}</GlassBadge>
        </div>
        <div className="px-4 pt-3 sm:px-5">
          <SearchBar value={successSearch} onChange={(v) => { setSuccessSearch(v); setSuccessPage(1); }} />
        </div>
        {loading ? (
          <SkeletonRows />
        ) : filteredSuccess.length === 0 ? (
          <EmptyState message="No successful deliveries yet" />
        ) : (
          <>
            {paginate(filteredSuccess, successPage).map((o) => (
              <OrderRow key={o.id} order={o} variant="success" />
            ))}
            <PaginationControls page={successPage} total={totalPages(filteredSuccess)} setPage={setSuccessPage} />
          </>
        )}
      </GlassPanel>

      {/* ❌ Unsuccessful Deliveries */}
      <GlassPanel>
        <div className="flex flex-wrap items-center gap-2 px-4 pt-4 sm:px-5">
          <h3 className="text-sm font-bold text-[#1A1A1A]">❌ Unsuccessful Deliveries</h3>
          <GlassBadge variant="worn" className="bg-[rgba(255,59,48,0.10)] border-[rgba(255,59,48,0.25)] text-[#D32F2F]">
            {filteredFail.length}
          </GlassBadge>
        </div>
        <div className="px-4 pt-3 sm:px-5">
          <SearchBar value={failSearch} onChange={(v) => { setFailSearch(v); setFailPage(1); }} />
        </div>
        {loading ? (
          <SkeletonRows />
        ) : filteredFail.length === 0 ? (
          <EmptyState message="No unsuccessful deliveries yet" />
        ) : (
          <>
            {paginate(filteredFail, failPage).map((o) => (
              <OrderRow key={o.id} order={o} variant="fail" />
            ))}
            <PaginationControls page={failPage} total={totalPages(filteredFail)} setPage={setFailPage} />
          </>
        )}
      </GlassPanel>
    </AdminLayout>
  );
};

export default OrderHistory;

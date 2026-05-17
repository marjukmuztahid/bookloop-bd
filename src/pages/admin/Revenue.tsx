import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, CalendarCheck, Package, ArrowUpDown, Filter } from 'lucide-react';
import { calculatePlatformFee } from '@/lib/utils';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';

const formatPrice = (n: number) => `৳${n.toLocaleString('en-BD')}`;

interface RevenueOrder {
  id: string;
  created_at: string;
  listing: {
    book_name: string;
    book_type?: string;
    seller_price: number;
    seller_id: string;
  };
  buyer: { full_name: string };
  seller: { full_name: string };
}

type SortKey = 'date' | 'fee';
type SortDir = 'asc' | 'desc';

const Revenue = () => {
  const [orders, setOrders] = useState<RevenueOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, listing_id, buyer_id, listings!orders_listing_id_fkey(book_name, book_type, seller_price, seller_id)')
        .eq('status', 'delivered');

      if (error) {
        console.error('Revenue orders query error:', error);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) { setOrders([]); setLoading(false); return; }

      const sellerIds = [...new Set((data as any[]).map(o => o.listings?.seller_id).filter(Boolean))];
      const buyerIds = [...new Set((data as any[]).map(o => o.buyer_id).filter(Boolean))];
      const allIds = [...new Set([...sellerIds, ...buyerIds])];

      const { data: users, error: usersError } = await supabase.from('users').select('id, full_name').in('id', allIds);
      if (usersError) console.error('Revenue users query error:', usersError);
      
      const userMap: Record<string, string> = {};
      (users || []).forEach(u => { userMap[u.id] = u.full_name; });

      const mapped: RevenueOrder[] = (data as any[]).map(o => ({
        id: o.id,
        created_at: o.created_at,
        listing: {
          book_name: o.listings?.book_name || 'Unknown',
          book_type: o.listings?.book_type,
          seller_price: o.listings?.seller_price || 0,
          seller_id: o.listings?.seller_id || '',
        },
        buyer: { full_name: userMap[o.buyer_id] || 'Unknown' },
        seller: { full_name: userMap[o.listings?.seller_id] || 'Unknown' },
      }));

      setOrders(mapped);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = orders;

    if (dateFrom) result = result.filter(o => o.created_at >= dateFrom);
    if (dateTo) result = result.filter(o => o.created_at <= dateTo + 'T23:59:59');


    result = [...result].sort((a, b) => {
      if (sortKey === 'date') {
        return sortDir === 'asc'
          ? a.created_at.localeCompare(b.created_at)
          : b.created_at.localeCompare(a.created_at);
      }
      const feeA = calculatePlatformFee(a.listing.seller_price);
      const feeB = calculatePlatformFee(b.listing.seller_price);
      return sortDir === 'asc' ? feeA - feeB : feeB - feeA;
    });

    return result;
  }, [orders, dateFrom, dateTo, sortKey, sortDir]);

  const totalAllTime = orders.reduce((s, o) => s + calculatePlatformFee(o.listing.seller_price), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekStart = new Date(now.getTime() - now.getDay() * 86400000);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartISO = weekStart.toISOString();

  const monthRevenue = orders
    .filter(o => o.created_at >= monthStart)
    .reduce((s, o) => s + calculatePlatformFee(o.listing.seller_price), 0);

  const weekRevenue = orders
    .filter(o => o.created_at >= weekStartISO)
    .reduce((s, o) => s + calculatePlatformFee(o.listing.seller_price), 0);

  const filteredTotal = filtered.reduce((s, o) => s + calculatePlatformFee(o.listing.seller_price), 0);

  const cards = [
    { label: 'Total Revenue', value: formatPrice(totalAllTime), icon: DollarSign, color: 'text-emerald-600' },
    { label: "This Month's Revenue", value: formatPrice(monthRevenue), icon: TrendingUp, color: 'text-blue-600' },
    { label: "This Week's Revenue", value: formatPrice(weekRevenue), icon: CalendarCheck, color: 'text-purple-600' },
    { label: 'Total Orders Completed', value: orders.length.toString(), icon: Package, color: 'text-orange-600' },
  ];

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <AdminLayout title="Revenue">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(c => (
            <motion.div key={c.label} variants={fadeUp}>
              <GlassPanel className="flex items-center gap-4 p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${c.color}`}>
                  <c.icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="text-lg font-bold text-foreground">{c.value}</p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div variants={fadeUp}>
          <GlassPanel className="flex flex-wrap items-end gap-4 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter size={14} /> Filters
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">From</label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 w-40 text-xs" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">To</label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 w-40 text-xs" />
            </div>
          </GlassPanel>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp}>
          <GlassPanel className="overflow-hidden p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8357A] border-t-transparent" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package size={48} className="mb-3 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">No completed orders yet.</p>
                <p className="text-xs text-muted-foreground/60">Revenue will show here once orders are delivered.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border/50 bg-muted/30">
                        <TableHead className="text-xs">Order ID</TableHead>
                        <TableHead className="text-xs">Book Title</TableHead>
                        <TableHead className="text-xs">Seller</TableHead>
                        <TableHead className="text-xs">Buyer</TableHead>
                        <TableHead className="text-xs text-right">Seller Price</TableHead>
                        <TableHead className="text-xs text-center">Fee %</TableHead>
                        <TableHead
                          className="cursor-pointer text-xs text-right select-none"
                          onClick={() => toggleSort('fee')}
                        >
                          Fee Earned <ArrowUpDown size={12} className="ml-0.5 inline" />
                        </TableHead>
                        <TableHead
                          className="cursor-pointer text-xs select-none"
                          onClick={() => toggleSort('date')}
                        >
                          Completed <ArrowUpDown size={12} className="ml-0.5 inline" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(o => {
                        const fee = calculatePlatformFee(o.listing.seller_price);
                        return (
                          <TableRow key={o.id} className="transition-colors hover:bg-muted/40">
                            <TableCell className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}…</TableCell>
                            <TableCell className="max-w-[180px] truncate text-sm font-medium text-foreground">
                              <span className={`mr-1.5 inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${o.listing.book_type === 'general' ? 'border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.10)] text-[#6D28D9]' : 'border-[rgba(10,132,255,0.25)] bg-[rgba(10,132,255,0.10)] text-[#0A5AA8]'}`}>
                                {o.listing.book_type === 'general' ? 'General' : 'Academic'}
                              </span>
                              {o.listing.book_name}
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{o.seller.full_name}</TableCell>
                            <TableCell className="text-sm text-foreground">{o.buyer.full_name}</TableCell>
                            <TableCell className="text-right text-sm text-foreground">{formatPrice(o.listing.seller_price)}</TableCell>
                            <TableCell className="text-center">
                              <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                10%
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-sm font-semibold text-emerald-600">{formatPrice(fee)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {/* Running total */}
                <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-3">
                  <span className="text-xs text-muted-foreground">{filtered.length} order{filtered.length !== 1 ? 's' : ''} shown</span>
                  <span className="text-sm font-bold text-foreground">
                    Total: <span className="text-emerald-600">{formatPrice(filteredTotal)}</span>
                  </span>
                </div>
              </>
            )}
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default Revenue;

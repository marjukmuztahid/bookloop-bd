import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Package, Truck, Users, DollarSign, Clock } from 'lucide-react';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pendingListings: 0, pendingOrders: 0, activeDeliveries: 0, totalUsers: 0, feeRevenue: 0 });
  const [activities, setActivities] = useState<any[]>([]);

  const fetchData = async () => {
    const [pL, pO, aD, tU, rev, act] = await Promise.all([
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('orders').select('id', { count: 'exact', head: true }).in('status', ['pickup_scheduled', 'in_transit']),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('listings(display_price, seller_price)').eq('status', 'delivered'),
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(10),
    ]);

    const fee = (rev.data || []).reduce((sum: number, o: any) => {
      const l = o.listings;
      return sum + (l ? l.display_price - l.seller_price : 0);
    }, 0);

    setStats({
      pendingListings: pL.count || 0,
      pendingOrders: pO.count || 0,
      activeDeliveries: aD.count || 0,
      totalUsers: tU.count || 0,
      feeRevenue: fee,
    });
    setActivities(act.data || []);
  };

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 60000); return () => clearInterval(t); }, []);

  const cards = [
    { icon: ClipboardList, label: 'Pending Listings', value: stats.pendingListings, urgent: stats.pendingListings > 0 },
    { icon: Package, label: 'Pending Orders', value: stats.pendingOrders, urgent: stats.pendingOrders > 0 },
    { icon: Truck, label: 'Active Deliveries', value: stats.activeDeliveries, urgent: false },
    { icon: Users, label: 'Total Users', value: stats.totalUsers, urgent: false },
    { icon: DollarSign, label: 'Fee Revenue', value: formatPrice(stats.feeRevenue), urgent: false },
  ];

  const timeAgo = (d: string) => {
    const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return `${Math.floor(m / 1440)}d ago`;
  };

  return (
    <AdminLayout title="Dashboard">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {cards.map((c, i) => (
            <motion.div key={i} variants={fadeUp}
              className={`glass-panel-sm p-4 ${c.urgent ? 'ring-2 ring-[rgba(255,159,10,0.40)]' : ''}`}>
              <c.icon size={18} className="mb-2 text-[#8A8A8A]" />
              <p className="text-xs text-[#8A8A8A]">{c.label}</p>
              <p className="text-xl font-extrabold text-[#1A1A1A]">{c.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <GlassButton onClick={() => navigate('/admin/listings')}>Review Listings</GlassButton>
          <GlassButton onClick={() => navigate('/admin/orders')}>Approve Orders</GlassButton>
          <GlassButton variant="secondary" onClick={() => navigate('/admin/deliveries')}>Manage Deliveries</GlassButton>
        </div>

        {/* Activity feed */}
        <div className="glass-panel p-5">
          <h3 className="mb-4 text-base font-bold text-[#1A1A1A]">Recent Activity</h3>
          {!activities.length ? (
            <p className="text-sm text-[#8A8A8A]">No recent activity</p>
          ) : (
            <div className="flex flex-col gap-2">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl bg-[rgba(0,0,0,0.02)] p-3">
                  <p className="text-xs text-[#3A3A3A]">{a.description}</p>
                  <span className="flex-shrink-0 text-[10px] text-[#8A8A8A]">{timeAgo(a.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;

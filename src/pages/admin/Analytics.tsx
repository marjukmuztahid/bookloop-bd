import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatPrice = (n: number) => `৳ ${n.toLocaleString('en-BD')}`;

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, totalListings: 0, totalOrders: 0, deliveredOrders: 0, cancelledOrders: 0, feeRevenue: 0,
  });
  const [ordersOverTime, setOrdersOverTime] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [classLevels, setClassLevels] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [users, listings, orders, delivered, cancelled, revenue] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'delivered'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
        supabase.from('orders').select('listings(seller_price)').eq('status', 'delivered'),
      ]);

      const fee = (revenue.data || []).reduce((sum: number, o: any) => {
        const l = o.listings;
        return sum + (l ? l.display_price - l.seller_price : 0);
      }, 0);

      setStats({
        totalUsers: users.count || 0,
        totalListings: listings.count || 0,
        totalOrders: orders.count || 0,
        deliveredOrders: delivered.count || 0,
        cancelledOrders: cancelled.count || 0,
        feeRevenue: fee,
      });

      // Orders over last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      const { data: recentOrders } = await supabase.from('orders').select('created_at').gte('created_at', thirtyDaysAgo);
      const dayMap: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        dayMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
      }
      (recentOrders || []).forEach((o: any) => {
        const key = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (key in dayMap) dayMap[key]++;
      });
      setOrdersOverTime(Object.entries(dayMap).map(([date, count]) => ({ date, count })));

      // Categories
      const { data: allListings } = await supabase.from('listings').select('curriculum, class_level');
      const currMap: Record<string, number> = {};
      const classMap: Record<string, number> = {};
      const distMap: Record<string, number> = {};
      (allListings || []).forEach((l: any) => {
        currMap[l.curriculum] = (currMap[l.curriculum] || 0) + 1;
        classMap[l.class_level] = (classMap[l.class_level] || 0) + 1;
      });
      setCategories(Object.entries(currMap).map(([name, count]) => ({ name, count })));
      setClassLevels(
        Object.entries(classMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }))
      );

      // Districts from users
      const { data: allUsers } = await supabase.from('users').select('district');
      (allUsers || []).forEach((u: any) => {
        distMap[u.district] = (distMap[u.district] || 0) + 1;
      });
      setDistricts(
        Object.entries(distMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, count }))
      );
    };
    fetch();
  }, []);

  const cancelRate = stats.totalOrders > 0 ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100) : 0;
  const pieData = [
    { name: 'Delivered', value: stats.deliveredOrders, color: '#30D158' },
    { name: 'Cancelled', value: stats.cancelledOrders, color: '#FF453A' },
  ];
  const maxClassCount = classLevels.length ? Math.max(...classLevels.map((c) => c.count)) : 1;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Listings', value: stats.totalListings },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Delivered', value: stats.deliveredOrders },
    { label: 'Total Revenue', value: formatPrice(stats.feeRevenue) },
    { label: 'Cancel Rate', value: `${cancelRate}%` },
  ];

  return (
    <AdminLayout title="Analytics">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {statCards.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-panel-sm p-4">
              <p className="text-xs text-[#8A8A8A]">{s.label}</p>
              <p className="text-lg font-extrabold text-[#1A1A1A]">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Orders over time */}
          <div className="glass-panel p-5">
            <h3 className="mb-4 text-sm font-bold text-[#1A1A1A]">Orders (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#E8357A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Categories */}
          <div className="glass-panel p-5">
            <h3 className="mb-4 text-sm font-bold text-[#1A1A1A]">Popular Categories</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#E8357A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Districts */}
          <div className="glass-panel p-5">
            <h3 className="mb-4 text-sm font-bold text-[#1A1A1A]">Top Districts</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={districts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#E8357A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Delivered vs Cancelled */}
          <div className="glass-panel p-5">
            <h3 className="mb-4 text-sm font-bold text-[#1A1A1A]">Delivered vs Cancelled</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class levels */}
        <div className="glass-panel p-5">
          <h3 className="mb-4 text-sm font-bold text-[#1A1A1A]">Popular Class Levels</h3>
          <div className="flex flex-col gap-2">
            {classLevels.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-6 text-right text-xs font-bold text-[#8A8A8A]">#{i + 1}</span>
                <span className="w-24 text-sm font-medium text-[#3A3A3A]">{c.name}</span>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded-full bg-[rgba(0,0,0,0.04)]">
                    <div className="h-full rounded-full bg-[rgba(232,53,122,0.20)]"
                      style={{ width: `${(c.count / maxClassCount) * 100}%` }} />
                  </div>
                </div>
                <span className="w-8 text-right text-xs font-bold text-[#3A3A3A]">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default Analytics;

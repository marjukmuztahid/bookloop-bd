import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ClipboardList, Package, Truck, Banknote, BellRing } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassBadge } from '@/components/ui/GlassBadge';
import { useNotifications } from '@/hooks/useNotifications';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const typeIcon = (type: string) => {
  switch (type) {
    case 'listing': return <ClipboardList size={16} />;
    case 'order': return <Package size={16} />;
    case 'delivery': return <Truck size={16} />;
    case 'payment': return <Banknote size={16} />;
    default: return <BellRing size={16} />;
  }
};

const timeAgo = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main {...pageTransition} className="mx-auto max-w-2xl px-4 pb-16 pt-24">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Notifications</h1>
            {unreadCount > 0 && (
              <GlassBadge variant="curriculum">{unreadCount} unread</GlassBadge>
            )}
          </div>
          {unreadCount > 0 && (
            <GlassButton variant="secondary" className="text-xs" onClick={markAllAsRead}>
              Mark all as read
            </GlassButton>
          )}
        </div>

        <div className="mb-4 flex w-fit gap-1 rounded-full bg-[rgba(0,0,0,0.04)] p-1">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === f ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]' : 'text-[#8A8A8A]'
              }`}
            >
              {f === 'all' ? 'All' : 'Unread'}
            </button>
          ))}
        </div>

        {!filtered.length ? (
          <div className="glass-panel flex flex-col items-center p-10 text-center">
            <Bell size={40} className="mb-3 text-[#8A8A8A]" />
            <p className="text-sm text-[#8A8A8A]">
              {filter === 'unread' ? 'No unread notifications' : "You're all caught up! 🎉"}
            </p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-2">
            {filtered.map((n) => (
              <motion.button
                key={n.id}
                variants={fadeUp}
                onClick={() => { if (!n.is_read) markAsRead(n.id); }}
                className={`glass-panel-sm flex w-full items-start gap-3 p-4 text-left transition-colors ${
                  !n.is_read ? 'bg-[rgba(232,53,122,0.04)]' : ''
                }`}
              >
                <span className="mt-0.5 flex-shrink-0 text-[#8A8A8A]">{typeIcon(n.type)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#3A3A3A]">{n.message}</p>
                  <p className="mt-1 text-xs text-[#8A8A8A]">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#E8357A]" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Notifications;

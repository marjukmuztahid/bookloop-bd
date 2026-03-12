import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ClipboardList, Package, Truck, Banknote, BellRing } from 'lucide-react';
import { useNotifications, type Notification } from '@/hooks/useNotifications';

const typeIcon = (type: string) => {
  switch (type) {
    case 'listing': return <ClipboardList size={14} />;
    case 'order': return <Package size={14} />;
    case 'delivery': return <Truck size={14} />;
    case 'payment': return <Banknote size={14} />;
    default: return <BellRing size={14} />;
  }
};

const timeAgo = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (n: Notification) => {
    if (!n.is_read) markAsRead(n.id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#8A8A8A] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#3A3A3A]"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E8357A] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="glass-panel absolute right-0 top-12 z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden"
            style={{ transformOrigin: 'top right' }}
          >
            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] px-4 py-3">
              <h3 className="text-sm font-bold text-[#1A1A1A]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#8A8A8A] transition-colors hover:text-[#E8357A]"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {!notifications.length ? (
                <p className="py-10 text-center text-sm text-[#8A8A8A]">You're all caught up! 🎉</p>
              ) : (
                notifications.slice(0, 20).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors hover:bg-[rgba(0,0,0,0.02)] ${
                      !n.is_read ? 'bg-[rgba(232,53,122,0.06)]' : ''
                    }`}
                  >
                    <span className="mt-0.5 flex-shrink-0 text-[#8A8A8A]">{typeIcon(n.type)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#3A3A3A]">{n.message}</p>
                      <p className="mt-0.5 text-[10px] text-[#8A8A8A]">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#E8357A]" />
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-2.5">
              <button
                onClick={() => { navigate('/notifications'); setOpen(false); }}
                className="w-full text-center text-xs font-semibold text-[#E8357A] transition-opacity hover:opacity-70"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

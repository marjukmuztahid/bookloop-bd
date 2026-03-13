import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';

const BUYING_STEPS = [
  { icon: '🔍', title: 'Browse or Search', desc: 'Find books by class, curriculum, or condition' },
  { icon: '📖', title: 'View Listing Details', desc: 'See photos, condition, and seller\'s district' },
  { icon: '🛒', title: 'Place Your Order', desc: 'Click "Order Now" and confirm your delivery address and COD amount' },
  { icon: '✅', title: 'Admin Review', desc: 'Our team reviews and approves your order' },
  { icon: '🚚', title: 'Courier Delivery', desc: 'Steadfast courier picks up and delivers to your door' },
  { icon: '💵', title: 'Pay on Delivery', desc: 'Pay the courier cash on delivery — no prepayment needed' },
];

const SELLING_STEPS = [
  { icon: '👤', title: 'Add Payment Info', desc: 'Add your bKash or Nagad number in your profile' },
  { icon: '📸', title: 'Post Your Book', desc: 'Add up to 3 photos, condition, class, and your price' },
  { icon: '✅', title: 'Admin Approval', desc: 'We review and approve your listing — you\'ll get notified' },
  { icon: '📦', title: 'Buyer Orders', desc: 'When ordered, admin schedules a Steadfast pickup from you' },
  { icon: '🚚', title: 'Courier Collects', desc: 'Steadfast collects the book and delivers to the buyer' },
  { icon: '💸', title: 'Get Paid', desc: 'Receive payment via bKash/Nagad minus a small platform fee (7% under ৳500, 5% above)' },
];

interface Props {
  onClose: () => void;
}

const HowItWorksModal = ({ onClose }: Props) => {
  const [tab, setTab] = useState<'buying' | 'selling'>('buying');
  const steps = tab === 'buying' ? BUYING_STEPS : SELLING_STEPS;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="glass-panel max-h-[85vh] w-full max-w-[560px] overflow-y-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-1 text-center text-lg font-bold text-[#1A1A1A]">How Book Loop BD Works</h2>
          <p className="mb-5 text-center text-sm text-[#8A8A8A]">Simple, safe, and student-friendly</p>

          {/* Tab toggle */}
          <div className="mx-auto mb-6 flex w-fit gap-1 rounded-full bg-[rgba(0,0,0,0.04)] p-1">
            <TabButton active={tab === 'buying'} onClick={() => setTab('buying')}>I'm Buying</TabButton>
            <TabButton active={tab === 'selling'} onClick={() => setTab('selling')}>I'm Selling</TabButton>
          </div>

          {/* Steps */}
          <motion.div
            key={tab}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-3"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 rounded-2xl bg-[rgba(0,0,0,0.02)] p-3">
                <span className="text-2xl">{step.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A]">{step.title}</h4>
                  <p className="text-xs text-[#8A8A8A]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom actions */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <GlassButton variant="secondary" onClick={onClose}>Skip for now</GlassButton>
            <GlassButton onClick={onClose}>Got it, let's go!</GlassButton>
          </div>
          <p className="mt-3 text-center text-xs text-[#8A8A8A]">
            You can revisit this anytime from the How It Works page
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
      active
        ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]'
        : 'text-[#8A8A8A] hover:text-[#3A3A3A]'
    }`}
  >
    {children}
  </button>
);

export default HowItWorksModal;

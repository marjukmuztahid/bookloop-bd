import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, fadeUp } from '@/lib/animations';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import useSEO from '@/hooks/useSEO';

const BUYING_STEPS = [
  { icon: '🔍', title: 'Browse or Search', desc: 'Find books by class, curriculum, or condition using our search and filter tools.' },
  { icon: '📖', title: 'View Listing Details', desc: 'Open a listing to see photos, condition details, price, and seller\'s district.' },
  { icon: '🛒', title: 'Place Your Order', desc: 'Click "Order Now", confirm your delivery address and the cash-on-delivery amount.' },
  { icon: '✅', title: 'Admin Reviews Your Order', desc: 'Our team reviews and approves your order to ensure everything is correct.' },
  { icon: '🚚', title: 'Courier Picks Up & Delivers', desc: 'Steadfast courier picks up the book from the seller and delivers it to your door.' },
  { icon: '💵', title: 'Pay on Delivery', desc: 'Pay the courier in cash when your book arrives — no prepayment needed.' },
];

const SELLING_STEPS = [
  { icon: '👤', title: 'Add Your Payment Info', desc: 'Go to your profile and add your bKash or Nagad number before listing any book.' },
  { icon: '📸', title: 'Post Your Book', desc: 'Upload up to 3 photos, set the condition, class level, and your desired price.' },
  { icon: '✅', title: 'Admin Approves Listing', desc: 'We review and approve your listing — you\'ll get a notification when it\'s live.' },
  { icon: '📦', title: 'Buyer Places an Order', desc: 'When someone orders your book, admin schedules a Steadfast pickup from your location.' },
  { icon: '🚚', title: 'Courier Collects the Book', desc: 'Steadfast collects the book from you and delivers it to the buyer.' },
  { icon: '💸', title: 'Receive Your Payment', desc: 'After delivery, you receive your payment via bKash/Nagad. A flat 10% platform fee is added on top of your asking price for the buyer.' },
];

const GOOD_TO_KNOW = [
  { icon: '💵', title: 'Cash on Delivery', desc: 'You never pay in advance. Pay the courier when your book arrives.' },
  { icon: '⏳', title: '60-Day Listings', desc: 'Listings stay live for 60 days. You\'ll get a reminder before expiry.' },
  { icon: '🔒', title: 'Admin Approved', desc: 'Every listing and order is reviewed by our team for safety.' },
];

const HowItWorks = () => {
  const [tab, setTab] = useState<'buying' | 'selling'>('buying');
  const steps = tab === 'buying' ? BUYING_STEPS : SELLING_STEPS;
  useSEO({
    title: 'How It Works — Book Loop BD',
    description: 'Learn how to buy and sell second-hand school books on Book Loop BD. Simple listings, admin approval, cash on delivery via Steadfast Courier.',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <motion.section {...pageTransition} className="mx-auto max-w-3xl px-4 pb-8 pt-16 text-center md:pt-24">
          <h1 className="mb-3 text-3xl font-extrabold text-[#1A1A1A] md:text-4xl">How Book Loop BD Works</h1>
          <p className="text-base text-[#8A8A8A]">Simple, safe, and student-friendly</p>
        </motion.section>

        {/* Tab toggle */}
        <div className="mx-auto mb-8 flex w-fit gap-1 rounded-full bg-[rgba(0,0,0,0.04)] p-1">
          <TabButton active={tab === 'buying'} onClick={() => setTab('buying')}>I'm Buying</TabButton>
          <TabButton active={tab === 'selling'} onClick={() => setTab('selling')}>I'm Selling</TabButton>
        </div>

        {/* Steps */}
        <motion.section
          key={tab}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-2xl px-4"
        >
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-panel-sm flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(0,0,0,0.04)] text-lg font-bold text-[#8A8A8A]">
                  {i + 1}
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-2xl">{step.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{step.title}</h3>
                    <p className="mt-0.5 text-xs text-[#8A8A8A]">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Good to Know */}
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="mb-6 text-center text-xl font-bold text-[#1A1A1A]">Good to Know</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {GOOD_TO_KNOW.map((item, i) => (
              <div key={i} className="glass-panel-sm p-5 text-center">
                <span className="mb-3 block text-3xl">{item.icon}</span>
                <h3 className="mb-1 text-sm font-bold text-[#1A1A1A]">{item.title}</h3>
                <p className="text-xs text-[#8A8A8A]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
      active
        ? 'bg-[rgba(232,53,122,0.12)] text-[#E8357A]'
        : 'text-[#8A8A8A] hover:text-[#3A3A3A]'
    }`}
  >
    {children}
  </button>
);

export default HowItWorks;

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
  { icon: '⏳', title: '90-Day Listings', desc: 'Listings stay live for 90 days. You\'ll get a reminder before expiry.' },
  { icon: '🔒', title: 'Admin Approved', desc: 'Every listing and order is reviewed by our team for safety.' },
];

const FAQ_QA = [
  {
    q: 'How do I buy a second-hand book on Book Loop BD?',
    a: 'Browse or search listings, open the book you want, click Order Now, and confirm your delivery address. After admin approval, Steadfast Courier picks up the book from the seller and delivers it to your door. You pay the courier in cash on delivery.',
  },
  {
    q: 'How do I sell my old school or college books?',
    a: 'Sign up, add your bKash or Nagad number and address in your profile, then click Sell. Upload up to 3 photos, set the condition, class level or genre, and your asking price. After admin approval your listing goes live for 90 days.',
  },
  {
    q: 'Is cash on delivery available across Bangladesh?',
    a: 'Yes. We use Steadfast Courier and deliver to all 64 districts of Bangladesh. Cash on delivery is the only payment method — you never pay in advance.',
  },
  {
    q: 'Can I get a refund if I do not like the book?',
    a: 'No. There are no refunds after a successful delivery. You inspect the book\'s condition at delivery and pay only if you accept it. All listings are reviewed by admins before going live to keep quality high.',
  },
  {
    q: 'What is the platform fee for sellers?',
    a: 'A flat 10% platform fee is added on top of your asking price for the buyer. You receive your full asking price via bKash or Nagad after the order is delivered successfully.',
  },
  {
    q: 'How long does a listing stay active?',
    a: 'Listings stay live for 90 days. You\'ll get a reminder notification before they expire.',
  },
];

const ARTICLES = [
  {
    icon: '📚',
    title: 'Buy & Sell Old Books in Bangladesh — The Complete Guide',
    body: [
      "Book Loop BD is Bangladesh's dedicated marketplace to buy old books and sell old books online. Whether you're hunting for old school textbooks, old college books, HSC or SSC guides, or general reading at the lowest old book price in Bangladesh, you can browse verified listings from students across all 64 districts.",
      "Sellers list used books in minutes and reach buyers nationwide. Buyers get old books price well below retail, with safe cash on delivery via Steadfast Courier — from Dhaka and Chattogram to Sylhet, Rajshahi and Khulna. Buying old books in Bangladesh has never been simpler.",
    ],
  },
  {
    icon: '💸',
    title: 'How to Get the Best Old Book Price in Bangladesh',
    body: [
      "Old book prices in Bangladesh depend on condition, demand, and edition. A 'Good' condition NCTB textbook for Class 9 or Class 10 typically sells for 40–60% of the new price, while HSC and SSC guides hold value longer because of repeat demand.",
      "On Book Loop BD you set your own asking price. Buyers see a transparent display price that includes our flat 10% platform fee — no hidden charges, no haggling. Use the price filters on the home page to quickly find the cheapest used books for your class.",
    ],
  },
  {
    icon: '🎓',
    title: 'Why Students Choose Second-Hand Books Over New Ones',
    body: [
      "A full set of new textbooks for SSC or HSC can cost thousands of taka every year. Second-hand books cut that bill in half — sometimes more — without sacrificing the content you need to study.",
      "Selling your old books after exams also recovers money you'd otherwise lose. Thousands of students across Bangladesh are already using Book Loop BD to buy old books cheap and sell old books fast, instead of letting them gather dust at home.",
    ],
  },
  {
    icon: '🛡️',
    title: 'Is It Safe to Buy Old Books Online in Bangladesh?',
    body: [
      "Yes — when the marketplace is properly moderated. Every listing on Book Loop BD is reviewed by an admin before going live, and every order is reviewed again before the courier is dispatched. You never pay in advance.",
      "Steadfast Courier handles pickup and delivery nationwide. You inspect the book at your door and pay cash on delivery only if you're happy with it. No prepayment, no online wallets required, no stranger-meetups.",
    ],
  },
  {
    icon: '📦',
    title: 'Old Books Delivery: How Cash on Delivery Works',
    body: [
      "Once your order is approved, Steadfast picks up the book from the seller's district and ships it to your address. Delivery typically takes 2–5 working days depending on location. A weight-based shipping rate is added to the cash-on-delivery amount shown at checkout.",
      "You pay the rider in cash when the book arrives. If you reject the parcel at the door, you owe nothing. Refunds after a successful delivery are not offered — so always inspect before accepting.",
    ],
  },
];

const HowItWorks = () => {
  const [tab, setTab] = useState<'buying' | 'selling'>('buying');
  const steps = tab === 'buying' ? BUYING_STEPS : SELLING_STEPS;
  useSEO({
    title: 'How to Buy & Sell Used Books in Bangladesh — Book Loop BD',
    description: 'Step-by-step guide to buying and selling second-hand school and college books on Book Loop BD. Cash on delivery, 10% seller fee, 60-day listings.',
    canonicalPath: '/how-it-works',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_QA.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
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

        {/* Articles / SEO content */}
        <section aria-labelledby="articles-heading" className="mx-auto max-w-3xl px-4 pb-16">
          <div className="mb-8 text-center">
            <h2 id="articles-heading" className="mb-2 text-xl font-bold text-[#1A1A1A] md:text-2xl">
              Guides for Buying & Selling Old Books in Bangladesh
            </h2>
            <p className="text-sm text-[#8A8A8A]">
              Short reads to help you get the best old book price and shop safely.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {ARTICLES.map((article, i) => (
              <motion.article
                key={i}
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: '-50px' }}
                className="glass-panel-sm p-5 md:p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(232,53,122,0.10)] text-lg">
                    {article.icon}
                  </span>
                  <h3 className="text-base font-bold text-[#1A1A1A] md:text-lg">{article.title}</h3>
                </div>
                <div className="space-y-3 pl-12 text-sm leading-relaxed text-[#3A3A3A]">
                  {article.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </motion.article>
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

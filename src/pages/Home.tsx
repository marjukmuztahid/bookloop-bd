import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { pageTransition, staggerContainer, fadeUp } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import BookCard from '@/components/ui/BookCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockBooks } from '@/data/mockBooks';
import { SkeletonGrid } from '@/components/ui/SkeletonBookCard';

const DISTRICTS = ['All', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
const CURRICULA = ['All', 'Bangla Version', 'English Version', 'English Medium'];
const CONDITIONS = ['All', 'New', 'Good', 'Fair', 'Worn'];
const CLASSES = ['All', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'SSC', 'HSC 1st Year', 'HSC 2nd Year', 'O-Level', 'A-Level'];
const BROWSE_CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'SSC', 'HSC 1st Year', 'HSC 2nd Year', 'O-Level', 'A-Level'];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [curriculum, setCurriculum] = useState('All');
  const [classLevel, setClassLevel] = useState('All');
  const [condition, setCondition] = useState('All');
  const [district, setDistrict] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeClassPill, setActiveClassPill] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const hasActiveFilter = curriculum !== 'All' || classLevel !== 'All' || condition !== 'All' || district !== 'All' || minPrice || maxPrice;

  const clearFilters = () => {
    setCurriculum('All');
    setClassLevel('All');
    setCondition('All');
    setDistrict('All');
    setMinPrice('');
    setMaxPrice('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const scrollToGrid = () => {
    document.getElementById('book-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <motion.section
          {...pageTransition}
          className="mx-auto max-w-3xl px-4 pb-8 pt-16 text-center md:pb-12 md:pt-24"
        >
          <h1 className="mb-4 text-3xl font-extrabold leading-tight text-[#1A1A1A] md:text-5xl">
            Give Your Books a Second Life
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-base text-[#8A8A8A] md:text-lg">
            Buy and sell school &amp; college books across Bangladesh. Safe, simple, student-friendly.
          </p>
          <div className="flex items-center justify-center gap-3">
            <GlassButton onClick={scrollToGrid}>Browse Books</GlassButton>
            <GlassButton variant="secondary" onClick={() => navigate('/sell')}>
              Start Selling
            </GlassButton>
          </div>
        </motion.section>

        {/* Search & Filter Bar */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mx-auto max-w-7xl px-4"
        >
          <div className="glass-panel p-4 md:p-6">
            {/* Search row */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={18} />
                <input
                  type="text"
                  placeholder="Search by book name, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] py-3 pl-11 pr-4 text-sm text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] focus:shadow-[0_0_0_3px_rgba(232,53,122,0.10)]"
                />
              </div>
              <GlassButton type="submit">Search</GlassButton>
            </form>

            {/* Filter row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <GlassSelect label="Curriculum" value={curriculum} onChange={setCurriculum} options={CURRICULA} active={curriculum !== 'All'} />
              <GlassSelect label="Class" value={classLevel} onChange={setClassLevel} options={CLASSES} active={classLevel !== 'All'} />
              <GlassSelect label="Condition" value={condition} onChange={setCondition} options={CONDITIONS} active={condition !== 'All'} />
              <GlassSelect label="District" value={district} onChange={setDistrict} options={DISTRICTS} active={district !== 'All'} />

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min ৳"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-20 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-2.5 py-2 text-xs text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)]"
                />
                <input
                  type="number"
                  placeholder="Max ৳"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-20 rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.04)] px-2.5 py-2 text-xs text-[#3A3A3A] placeholder-[#8A8A8A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)]"
                />
              </div>

              {hasActiveFilter && (
                <button onClick={clearFilters} className="whitespace-nowrap text-xs font-semibold text-[#E8357A] transition-opacity hover:opacity-70">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </motion.section>

        {/* Book Grid */}
        <section id="book-grid" className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="mb-6 text-xl font-bold text-[#1A1A1A]">Available Books</h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {mockBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </motion.div>

          {/* Pagination placeholder */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.60)] text-[#8A8A8A] transition-colors hover:text-[#E8357A]">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                  p === 1
                    ? 'border-[rgba(232,53,122,0.30)] bg-[rgba(232,53,122,0.12)] text-[#E8357A]'
                    : 'border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.60)] text-[#3A3A3A] hover:text-[#E8357A]'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.60)] text-[#8A8A8A] transition-colors hover:text-[#E8357A]">
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* Browse by Class */}
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <h2 className="mb-4 text-xl font-bold text-[#1A1A1A]">Browse by Class</h2>
          <div className="flex flex-wrap gap-2">
            {BROWSE_CLASSES.map((cls) => (
              <GlassButton
                key={cls}
                variant={activeClassPill === cls ? 'primary' : 'secondary'}
                className="rounded-full px-4 py-2 text-xs"
                onClick={() => {
                  setActiveClassPill(cls);
                  navigate(`/listings?class=${encodeURIComponent(cls)}`);
                }}
              >
                {cls}
              </GlassButton>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* Reusable glass select */
const GlassSelect = ({
  label,
  value,
  onChange,
  options,
  active,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  active: boolean;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label={label}
    className={`flex-shrink-0 cursor-pointer appearance-none rounded-[10px] border bg-[rgba(0,0,0,0.04)] px-3 py-2 text-xs font-medium text-[#3A3A3A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] ${
      active ? 'border-[rgba(232,53,122,0.30)]' : 'border-[rgba(0,0,0,0.08)]'
    }`}
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt === 'All' ? `${label}: All` : opt}
      </option>
    ))}
  </select>
);

export default Home;

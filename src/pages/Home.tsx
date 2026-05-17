import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { pageTransition, staggerContainer } from '@/lib/animations';
import { GlassButton } from '@/components/ui/GlassButton';
import BookCard from '@/components/ui/BookCard';
import type { BookCardData } from '@/components/ui/BookCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SkeletonGrid } from '@/components/ui/SkeletonBookCard';
import HowItWorksModal from '@/components/HowItWorksModal';
import useSEO from '@/hooks/useSEO';
import { supabase } from '@/integrations/supabase/client';
import { BANGLADESH_DISTRICTS } from '@/data/districts';
import { GENRES } from '@/data/genres';
import type { BookType } from '@/types';

const DISTRICTS = ['All', ...BANGLADESH_DISTRICTS];
const CURRICULA_MAP: Record<string, string> = { 'All': 'All', 'Bangla Version': 'bangla_version', 'English Version': 'english_version', 'English Medium': 'english_medium' };
const CURRICULA = Object.keys(CURRICULA_MAP);
const CONDITIONS_MAP: Record<string, string> = { 'All': 'All', 'New': 'new', 'Good': 'good', 'Fair': 'fair', 'Worn': 'worn' };
const CONDITIONS = Object.keys(CONDITIONS_MAP);
const CLASSES = ['All', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'SSC', 'HSC 1st Year', 'HSC 2nd Year', 'O-Level', 'A-Level'];
const GENRE_OPTIONS = ['All', ...GENRES];
const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low'];
const PAGE_SIZE = 12;

const TypingText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 110);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-[3px] ml-0.5 h-[0.85em] align-middle bg-[#E8357A] rounded-full"
        />
      )}
    </span>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useSEO({
    title: 'Book Loop BD — Buy & Sell Second Hand School Books in Bangladesh',
    description: "Bangladesh's student book marketplace. Buy and sell second-hand school and college books at affordable prices. Fast delivery across Bangladesh via Steadfast Courier.",
  });

  const [bookType, setBookType] = useState<BookType>(() => {
    if (typeof window === 'undefined') return 'academic';
    const saved = localStorage.getItem('bookTypeTab');
    return saved === 'general' ? 'general' : 'academic';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [curriculum, setCurriculum] = useState('All');
  const [classLevel, setClassLevel] = useState('All');
  const [genre, setGenre] = useState('All');
  const [condition, setCondition] = useState('All');
  const [district, setDistrict] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [isLoading, setIsLoading] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [books, setBooks] = useState<BookCardData[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Show walkthrough after signup
  useEffect(() => {
    const state = location.state as any;
    if (state?.showWalkthrough && localStorage.getItem('howItWorksShown') === 'false') {
      setShowWalkthrough(true);
      localStorage.setItem('howItWorksShown', 'true');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const switchTab = (t: BookType) => {
    if (t === bookType) return;
    setBookType(t);
    localStorage.setItem('bookTypeTab', t);
    // Reset filters on tab switch for clarity
    setCurriculum('All');
    setClassLevel('All');
    setGenre('All');
    setCondition('All');
    setDistrict('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('Default');
    setPage(1);
  };

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    const userJoin = district !== 'All'
      ? 'users!listings_seller_id_fkey!inner(district)'
      : 'users!listings_seller_id_fkey(district)';
    let q = supabase
      .from('listings')
      .select(`id, book_name, author_publisher, curriculum, class_level, condition, display_price, photos, status, book_type, genre, ${userJoin}`, { count: 'exact' })
      .in('status', ['available', 'sold_pending_delivery'])
      .eq('book_type', bookType);

    if (sortBy === 'Price: Low to High') {
      q = q.order('display_price', { ascending: true });
    } else if (sortBy === 'Price: High to Low') {
      q = q.order('display_price', { ascending: false });
    } else {
      q = q.order('created_at', { ascending: false });
    }

    if (bookType === 'academic') {
      if (curriculum !== 'All') q = q.eq('curriculum', CURRICULA_MAP[curriculum]);
      if (classLevel !== 'All') q = q.eq('class_level', classLevel);
    } else {
      if (genre !== 'All') q = q.eq('genre', genre);
    }
    if (condition !== 'All') q = q.eq('condition', CONDITIONS_MAP[condition]);
    if (district !== 'All') q = (q as any).eq('users.district', district);
    if (minPrice) q = q.gte('display_price', Number(minPrice));
    if (maxPrice) q = q.lte('display_price', Number(maxPrice));
    if (searchQuery.trim()) {
      const term = `%${searchQuery.trim()}%`;
      q = q.or(`book_name.ilike.${term},author_publisher.ilike.${term}`);
    }

    const from = (page - 1) * PAGE_SIZE;
    q = q.range(from, from + PAGE_SIZE - 1);

    const { data, count } = await q;
    const mapped: BookCardData[] = (data || []).map((l: any) => ({
      id: l.id,
      book_name: l.book_name,
      author_publisher: l.author_publisher,
      curriculum: l.curriculum,
      class_level: l.class_level,
      condition: l.condition,
      display_price: l.display_price,
      photos: l.photos || [],
      seller_district: l.users?.district || 'Unknown',
      status: l.status,
      book_type: l.book_type,
      genre: l.genre,
    }));
    setBooks(mapped);
    setTotalCount(count || 0);
    setIsLoading(false);
  }, [bookType, curriculum, classLevel, genre, condition, district, minPrice, maxPrice, page, searchQuery, sortBy]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasActiveFilter =
    (bookType === 'academic' ? (curriculum !== 'All' || classLevel !== 'All') : genre !== 'All') ||
    condition !== 'All' || district !== 'All' || minPrice || maxPrice || sortBy !== 'Default';

  const clearFilters = () => {
    setCurriculum('All');
    setClassLevel('All');
    setGenre('All');
    setCondition('All');
    setDistrict('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('Default');
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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
            <TypingText text="Give Your Books a Second Life" />
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-base text-[#8A8A8A] md:text-lg">
            Buy and sell school &amp; college books across Bangladesh. Safe, simple, student-friendly.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={scrollToGrid}
              className="group relative flex items-center justify-center overflow-hidden rounded-[20px] border-t border-white/20 bg-[rgba(232,53,122,0.85)] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(232,53,122,0.4)] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-[rgba(232,53,122,0.92)] hover:shadow-[0_14px_36px_-10px_rgba(232,53,122,0.5)] active:scale-95"
            >
              <span className="relative z-10">Browse Books</span>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
              <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => navigate('/sell')}
              className="group relative flex items-center justify-center rounded-[20px] border border-white bg-white/70 px-8 py-3.5 text-[15px] font-semibold text-[#1A1A1A] shadow-[0_4px_12px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-white/90 hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)] active:scale-95"
            >
              <span className="relative z-10">Start Selling</span>
              <span className="pointer-events-none absolute inset-0 rounded-[20px] border border-white/50" />
            </button>
          </div>
        </motion.section>

        {/* Book Type Tabs */}
        <section className="mx-auto mb-4 max-w-7xl px-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/40 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
              <TypeTab active={bookType === 'academic'} onClick={() => switchTab('academic')}>
                Academic Books
              </TypeTab>
              <TypeTab active={bookType === 'general'} onClick={() => switchTab('general')}>
                General Books
              </TypeTab>
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={bookType}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Search & Filter Bar */}
            <section className="mx-auto max-w-7xl px-4">
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
                  {bookType === 'academic' ? (
                    <>
                      <GlassSelect label="Curriculum" value={curriculum} onChange={setCurriculum} options={CURRICULA} active={curriculum !== 'All'} />
                      <GlassSelect label="Class" value={classLevel} onChange={setClassLevel} options={CLASSES} active={classLevel !== 'All'} />
                    </>
                  ) : (
                    <GlassSelect label="Genre" value={genre} onChange={setGenre} options={GENRE_OPTIONS} active={genre !== 'All'} />
                  )}
                  <GlassSelect label="Condition" value={condition} onChange={setCondition} options={CONDITIONS} active={condition !== 'All'} />
                  <GlassSelect label="District" value={district} onChange={setDistrict} options={DISTRICTS} active={district !== 'All'} />

                  {/* Sort dropdown */}
                  <div className="relative flex-shrink-0">
                    <select
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                      aria-label="Sort by"
                      className={`cursor-pointer appearance-none rounded-[10px] border bg-[rgba(0,0,0,0.04)] py-2 pl-8 pr-3 text-xs font-medium text-[#3A3A3A] outline-none transition-all duration-200 focus:border-[rgba(232,53,122,0.40)] ${
                        sortBy !== 'Default' ? 'border-[rgba(232,53,122,0.30)] text-[#E8357A]' : 'border-[rgba(0,0,0,0.08)]'
                      }`}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt === 'Default' ? 'Sort: Default' : opt}</option>
                      ))}
                    </select>
                    <ArrowUpDown size={13} className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 ${sortBy !== 'Default' ? 'text-[#E8357A]' : 'text-[#8A8A8A]'}`} />
                  </div>

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
            </section>

            {/* Book Grid */}
            <section id="book-grid" className="mx-auto max-w-7xl px-4 py-10">
              <h2 className="mb-6 text-xl font-bold text-[#1A1A1A]">
                {bookType === 'academic' ? 'Available Academic Books' : 'Available General Books'}
              </h2>
              {isLoading ? (
                <SkeletonGrid count={8} />
              ) : books.length === 0 ? (
                <p className="py-10 text-center text-sm text-[#8A8A8A]">No books found. Check back soon!</p>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-2 gap-4 md:grid-cols-4"
                >
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.60)] text-[#8A8A8A] transition-colors hover:text-[#E8357A] disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                        p === page
                          ? 'border-[rgba(232,53,122,0.30)] bg-[rgba(232,53,122,0.12)] text-[#E8357A]'
                          : 'border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.60)] text-[#3A3A3A] hover:text-[#E8357A]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.60)] text-[#8A8A8A] transition-colors hover:text-[#E8357A] disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {showWalkthrough && <HowItWorksModal onClose={() => setShowWalkthrough(false)} />}
    </div>
  );
};

const TypeTab = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="relative flex items-center justify-center rounded-full px-6 py-2 transition-all duration-300 sm:px-8 sm:py-2.5"
  >
    {active && (
      <span className="absolute inset-0 rounded-full bg-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.08)]" />
    )}
    <span
      className={`relative text-sm tracking-tight transition-colors duration-300 ${
        active ? 'font-semibold text-[#E8357A]' : 'font-medium text-[#8A8A8A] hover:text-[#3A3A3A]'
      }`}
    >
      {children}
    </span>
  </button>
);

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

import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeUp } from '@/lib/animations';
import { GlassBadge } from '@/components/ui/GlassBadge';
import type { BookCondition, Curriculum, BookType, Genre } from '@/types';

export interface BookCardData {
  id: string;
  book_name: string;
  author_publisher: string;
  curriculum: Curriculum | null;
  class_level: string | null;
  condition: BookCondition;
  display_price: number;
  photos: string[];
  seller_district: string;
  status?: string;
  quantity?: number;
  book_type?: BookType;
  genre?: Genre | null;
}

const curriculumLabels: Record<Curriculum, string> = {
  bangla_version: 'Bangla Version',
  english_version: 'English Version',
  english_medium: 'English Medium',
  university: 'University',
  test_prep: 'Test Prep',
};

const BookCard = ({ book }: { book: BookCardData }) => {
  const navigate = useNavigate();
  const qty = book.quantity ?? 1;
  const isGeneral = book.book_type === 'general';
  const isUnavailable =
    book.status === 'sold' || book.status === 'sold_pending_delivery' || qty === 0;
  const isSold = book.status === 'sold' || qty === 0;
  const cover = book.photos[0] || '/placeholder.svg';

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      onClick={() => navigate(`/listings/${book.id}`)}
      className="group glass-panel cursor-pointer overflow-hidden p-3 hover:shadow-[0_18px_40px_-16px_rgba(232,53,122,0.25)]"
    >
      {/* Cover photo frame */}
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[18px]">
        {/* Soft color halo behind cover */}
        <img
          src={cover}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl saturate-150"
        />
        {/* Main cover */}
        <img
          src={cover}
          alt={`${book.class_level ?? book.genre ?? ''} ${book.book_name} ${book.condition} condition — Book Loop BD`}
          width={300}
          height={400}
          loading="lazy"
          decoding="async"
          className={`relative h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] ${
            isSold ? 'grayscale-[0.6]' : ''
          }`}
        />
        {/* Glass sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        {/* Inner ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/40" />

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/10 via-black/20 to-black/45">
            <span className="rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold text-[#3A3A3A] backdrop-blur-md">
              {isSold ? 'Sold' : 'Currently Unavailable'}
            </span>
          </div>
        )}
      </div>

      {/* Book name (2 lines max) */}
      <h3 className="mb-1 line-clamp-2 min-h-[2.4em] text-[14px] font-semibold leading-tight tracking-tight text-heading">
        {book.book_name}
      </h3>

      {/* Author */}
      <p className="mb-2 truncate text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        {book.author_publisher}
      </p>

      {/* Single badge row */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {isGeneral
          ? book.genre && <GlassBadge variant="genre" className="px-2 py-0.5 text-[10px]">{book.genre}</GlassBadge>
          : book.curriculum && (
              <GlassBadge variant="curriculum" className="px-2 py-0.5 text-[10px]">
                {curriculumLabels[book.curriculum]}
              </GlassBadge>
            )}
        <GlassBadge variant={book.condition} className="gap-1 px-2 py-0.5 text-[10px]">
          <Sparkles size={10} />
          {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
        </GlassBadge>
      </div>

      {/* Price + district row */}
      <div className="flex items-center justify-between border-t border-white/40 pt-2">
        <p className="text-[17px] font-bold tracking-tight text-primary">
          ৳ {book.display_price.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin size={11} />
          <span className="truncate">{book.seller_district}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;

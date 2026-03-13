import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeUp, cardHover } from '@/lib/animations';
import { GlassBadge } from '@/components/ui/GlassBadge';
import type { BookCondition, Curriculum } from '@/types';

export interface BookCardData {
  id: string;
  book_name: string;
  author_publisher: string;
  curriculum: Curriculum;
  condition: BookCondition;
  display_price: number;
  photos: string[];
  seller_district: string;
  status?: string;
}

const curriculumLabels: Record<Curriculum, string> = {
  bangla_version: 'Bangla Version',
  english_version: 'English Version',
  english_medium: 'English Medium',
};

const BookCard = ({ book }: { book: BookCardData }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={fadeUp}
      {...cardHover}
      onClick={() => navigate(`/listings/${book.id}`)}
      className="glass-panel cursor-pointer overflow-hidden p-3"
    >
      {/* Cover photo */}
      <div className="relative mb-3 overflow-hidden rounded-[14px]" style={{ aspectRatio: '3/4' }}>
        <img
          src={book.photos[0] || '/placeholder.svg'}
          alt={book.book_name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {book.status === 'sold_pending_delivery' && (
          <div className="absolute inset-0 flex items-end justify-center bg-black/30 pb-3">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-[#3A3A3A]">Currently Unavailable</span>
          </div>
        )}
      </div>

      {/* Book name */}
      <h3 className="mb-0.5 truncate text-sm font-bold text-[#1A1A1A]">{book.book_name}</h3>

      {/* Author */}
      <p className="mb-2 truncate text-xs text-[#8A8A8A]">{book.author_publisher}</p>

      {/* Badges */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        <GlassBadge variant="curriculum">{curriculumLabels[book.curriculum]}</GlassBadge>
        <GlassBadge variant={book.condition}>{book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}</GlassBadge>
      </div>

      {/* Price */}
      <p className="mb-1 text-base font-bold text-[#E8357A]">৳ {book.display_price.toLocaleString()}</p>

      {/* District */}
      <div className="flex items-center gap-1 text-xs text-[#8A8A8A]">
        <MapPin size={12} />
        <span>{book.seller_district}</span>
      </div>
    </motion.div>
  );
};

export default BookCard;

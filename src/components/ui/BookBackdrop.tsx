import { motion } from 'framer-motion';

/**
 * Decorative floating books backdrop for the homepage.
 * Pure presentation: absolute-positioned SVGs, pointer-events-none, behind content.
 */
const BookBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Soft color blobs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#E8357A]/10 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-[#7A9BE8]/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#E8C957]/10 blur-3xl" />

      {/* Floating books */}
      <FloatingBook className="absolute left-[6%] top-[12%] h-10 w-10 text-[#E8357A]/30" delay={0} rotate={-12} />
      <FloatingBook className="absolute right-[8%] top-[18%] h-14 w-14 text-[#7A9BE8]/30" delay={0.6} rotate={15} />
      <FloatingBook className="absolute left-[12%] top-[55%] h-12 w-12 text-[#57C9A7]/30" delay={1.2} rotate={-8} />
      <FloatingBook className="absolute right-[10%] top-[60%] h-9 w-9 text-[#E8C957]/35" delay={0.3} rotate={20} />
      <FloatingBook className="absolute left-[45%] top-[8%] h-8 w-8 text-[#E8357A]/25" delay={0.9} rotate={6} />
      <FloatingBook className="absolute right-[35%] top-[80%] h-11 w-11 text-[#7A9BE8]/25" delay={1.5} rotate={-18} />
      <FloatingBook className="absolute left-[3%] top-[85%] h-10 w-10 text-[#E8C957]/30" delay={0.4} rotate={10} />
    </div>
  );
};

const FloatingBook = ({
  className,
  delay,
  rotate,
}: {
  className: string;
  delay: number;
  rotate: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20, rotate }}
    animate={{
      opacity: 1,
      y: [0, -12, 0],
      rotate: [rotate, rotate + 4, rotate],
    }}
    transition={{
      opacity: { duration: 1.2, delay },
      y: { duration: 6, delay, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 6, delay, repeat: Infinity, ease: 'easeInOut' },
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z" />
      <path d="M8 6h8M8 10h6" />
    </svg>
  </motion.div>
);

export default BookBackdrop;

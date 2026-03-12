import { motion, type HTMLMotionProps } from 'framer-motion';
import { springButton } from '@/lib/animations';
import { cn } from '@/lib/utils';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'destructive';

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[rgba(232,53,122,0.12)] border-[rgba(232,53,122,0.30)] text-[#E8357A] hover:bg-[rgba(232,53,122,0.20)]',
  secondary:
    'bg-[rgba(255,255,255,0.60)] border-[rgba(0,0,0,0.08)] text-[#3A3A3A] hover:bg-[rgba(255,255,255,0.80)]',
  success:
    'bg-[rgba(48,209,88,0.10)] border-[rgba(48,209,88,0.25)] text-[#1A7A35] hover:bg-[rgba(48,209,88,0.18)]',
  destructive:
    'bg-[rgba(255,69,58,0.10)] border-[rgba(255,69,58,0.25)] text-[#C0392B] hover:bg-[rgba(255,69,58,0.18)]',
};

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant;
  children: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold backdrop-blur-[12px] transition-colors',
          variantStyles[variant],
          className
        )}
        {...springButton}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
export type { GlassButtonProps, Variant as GlassButtonVariant };

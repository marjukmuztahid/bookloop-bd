import { cn } from '@/lib/utils';
import React from 'react';

type BadgeVariant = 'new' | 'good' | 'fair' | 'worn' | 'curriculum';

const variantStyles: Record<BadgeVariant, string> = {
  new: 'bg-[rgba(48,209,88,0.12)] border-[rgba(48,209,88,0.30)] text-[#1A7A35]',
  good: 'bg-[rgba(10,132,255,0.10)] border-[rgba(10,132,255,0.25)] text-[#0A5AA8]',
  fair: 'bg-[rgba(255,159,10,0.12)] border-[rgba(255,159,10,0.30)] text-[#A0600A]',
  worn: 'bg-[rgba(0,0,0,0.06)] border-[rgba(0,0,0,0.12)] text-[#5A5A5A]',
  curriculum: 'bg-[rgba(232,53,122,0.10)] border-[rgba(232,53,122,0.25)] text-[#E8357A]',
};

interface GlassBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

const GlassBadge: React.FC<GlassBadgeProps> = ({ variant, className, children, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-[8px]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { GlassBadge };
export type { GlassBadgeProps, BadgeVariant };

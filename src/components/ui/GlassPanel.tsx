import { cn } from '@/lib/utils';
import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm';
}

const GlassPanel: React.FC<GlassPanelProps> = ({ size = 'default', className, children, ...props }) => {
  return (
    <div
      className={cn(
        size === 'sm' ? 'glass-panel-sm' : 'glass-panel',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { GlassPanel };
export type { GlassPanelProps };

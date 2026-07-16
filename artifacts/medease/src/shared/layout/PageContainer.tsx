import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { LAYOUT } from '@/shared/layout/constants';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full animate-in fade-in duration-[175ms]',
        'px-4 md:px-6 lg:px-8',
        className,
      )}
      style={{ maxWidth: LAYOUT.pageMaxWidth }}
    >
      {children}
    </div>
  );
}

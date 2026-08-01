import { cn } from '@/shared/lib/utils';

const toneClass = {
  primary: 'bg-primary',
  blue: 'bg-sky-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
} as const;

interface MarketingEyebrowProps {
  label: string;
  tone?: keyof typeof toneClass;
  className?: string;
}

export function MarketingEyebrow({
  label,
  tone = 'primary',
  className,
}: MarketingEyebrowProps) {
  return (
    <div className={cn('mb-4 flex justify-center', className)}>
      <span className="marketing-pill">
        <span className={cn('marketing-pill-dot', toneClass[tone])} />
        {label}
      </span>
    </div>
  );
}

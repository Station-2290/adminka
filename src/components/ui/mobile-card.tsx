import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <Card className={cn('mb-4 md:hidden', className)}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

interface MobileCardRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export function MobileCardRow({ label, value, className }: MobileCardRowProps) {
  return (
    <div className={cn('flex justify-between items-center py-1', className)}>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

interface MobileCardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function MobileCardHeader({ title, subtitle, actions }: MobileCardHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium">{title}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
        )}
      </div>
      {actions && (
        <div className="ml-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
import { cn } from '@/lib/utils';

export function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10', className)}>
      {children}
    </div>
  );
}
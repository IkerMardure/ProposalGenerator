import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-ink text-paper hover:opacity-90',
    secondary: 'bg-white/70 text-ink border border-ink/10 hover:bg-white',
    ghost: 'bg-transparent text-ink hover:bg-ink/5'
  }[variant];

  return <button className={cn('rounded-full px-5 py-3 text-sm font-medium transition', styles, className)} {...props} />;
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function ButtonLink({ href, children, className, variant = 'primary' }: ButtonLinkProps) {
  const styles = {
    primary: 'bg-ink text-paper hover:opacity-90',
    secondary: 'bg-white/70 text-ink border border-ink/10 hover:bg-white',
    ghost: 'bg-transparent text-ink hover:bg-ink/5'
  }[variant];

  return (
    <Link className={cn('inline-flex rounded-full px-5 py-3 text-sm font-medium transition', styles, className)} href={href}>
      {children}
    </Link>
  );
}
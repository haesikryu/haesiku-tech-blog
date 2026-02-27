import { type ReactNode } from 'react';

type BadgeVariant = 'category' | 'tag' | 'status';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  category: 'bg-blue-100 text-blue-700',
  tag: 'bg-gray-100 text-gray-700',
  status: 'bg-green-100 text-green-700',
};

export default function Badge({ children, variant = 'tag', className = '' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

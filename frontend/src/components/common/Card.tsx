import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
}

export default function Card({ children, className = '', as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>
      {children}
    </Tag>
  );
}

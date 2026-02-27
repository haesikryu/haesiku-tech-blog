interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const sizeStyles = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export default function Loading({ size = 'md', message = '로딩 중...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status">
      <div
        className={`animate-spin rounded-full border-gray-300 border-t-blue-600 ${sizeStyles[size]}`}
      />
      <span className="sr-only">{message}</span>
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  );
}

import { Loader } from 'lucide-react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader className={`animate-spin text-indigo-600 ${sizeClasses[size]} ${className}`} />
  );
}

'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 48 }: LoadingSpinnerProps) {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <Loader2 
        className={cn("animate-spin text-primary", className)} 
        size={size}
      />
    </div>
  );
}

// Thêm một phiên bản full screen nếu cần
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm">
      <LoadingSpinner size={48} />
    </div>
  );
} 
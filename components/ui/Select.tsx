'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/classnames';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all',
            'bg-white text-gray-900',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:ring-blue-500 focus:border-transparent',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };

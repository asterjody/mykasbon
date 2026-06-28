'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/classnames'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-gray-100 shadow-sm',
          variant === 'hover' && 'transition-all hover:shadow-md hover:border-gray-200',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }
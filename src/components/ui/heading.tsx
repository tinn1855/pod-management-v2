import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headingVariants = cva('font-bold tracking-tight', {
  variants: {
    variant: {
      h1: 'text-3xl lg:text-4xl',
      h2: 'text-2xl lg:text-3xl',
      h3: 'text-xl lg:text-2xl',
      h4: 'text-lg lg:text-xl',
      h5: 'text-base lg:text-lg',
      h6: 'text-sm lg:text-base',
    },
  },
  defaultVariants: {
    variant: 'h1',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant = 'h1', as, ...props }, ref) => {
    const Component = as || variant || 'h1';
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };

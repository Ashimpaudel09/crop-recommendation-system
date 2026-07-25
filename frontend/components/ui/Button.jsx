import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 border rounded-md whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-light';
  
  const variants = {
    primary: 'bg-accent text-text-inverse border-accent hover:bg-accent-hover hover:border-accent-hover',
    secondary: 'bg-surface-card text-text-secondary border-border hover:bg-surface-raised hover:border-border-strong hover:text-text-primary',
    danger: 'bg-danger-light text-danger border-transparent hover:bg-danger hover:text-text-inverse',
    ghost: 'bg-transparent text-text-secondary border-transparent hover:bg-surface-raised hover:text-text-primary'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-[13px] px-4 py-2',
    lg: 'text-sm px-5 py-3'
  };

  const isDisabled = disabled || isLoading;
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {!isLoading && children}
    </button>
  );
}

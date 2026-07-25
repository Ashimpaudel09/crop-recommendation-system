import React, { forwardRef } from 'react';

export const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="block text-[13px] font-medium text-text-secondary mb-1.5">{label}</label>}
      <select
        ref={ref}
        suppressHydrationWarning
        className={`w-full bg-surface-card border rounded-md px-3 py-2 text-sm text-text-primary transition-all duration-150 outline-none focus:border-border-focus focus:ring-4 focus:ring-accent-light/30 ${
          error ? 'border-danger' : 'border-border'
        }`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger mt-1">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

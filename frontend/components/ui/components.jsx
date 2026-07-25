import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface-card border border-border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-strong rounded-xl bg-surface">
      <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center text-text-muted mb-4">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

export function Alert({ type = 'info', message, title }) {
  const types = {
    info: 'bg-info-light border-info-light text-info-text',
    error: 'bg-danger-light border-danger-light text-danger-text',
    success: 'bg-success-light border-success-light text-accent-text',
    warning: 'bg-warning-light border-warning-light text-warning-text',
  };

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${types[type]} mb-6`}>
      <AlertCircle size={20} className="shrink-0 mt-0.5" />
      <div>
        {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    success: 'bg-success-light text-accent-text',
    warning: 'bg-warning-light text-warning-text',
    danger: 'bg-danger-light text-danger-text',
    info: 'bg-info-light text-info-text',
    default: 'bg-surface-raised text-text-secondary',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium leading-relaxed ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

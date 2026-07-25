"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="spinner spinner-lg text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-surface-card p-10 rounded-2xl shadow-xl border border-border text-center">
          <div className="w-16 h-16 bg-accent-light text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={28} />
          </div>
          
          <h2 className="text-2xl font-semibold text-text-primary mb-3">Sign in Required</h2>
          
          <p className="text-[15px] text-text-secondary leading-relaxed mb-8">
            Please sign in to access your personal farm records, financial dashboard, and personalized reports.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <Button size="lg" className="w-full">Sign In</Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button variant="secondary" size="lg" className="w-full">Create Account</Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <Link href="/" className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

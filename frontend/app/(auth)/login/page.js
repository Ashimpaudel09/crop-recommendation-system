"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Sprout, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-[0_0_45%] bg-surface-raised border-r border-border flex-col justify-center px-16">
        <div className="max-w-[420px]">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-accent text-white p-2.5 rounded-xl shadow-sm">
              <Sprout size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">
              CropSys
            </span>
          </div>
          <h2 className="text-[32px] font-semibold text-text-primary leading-tight mb-5 tracking-tight">
            Manage your farm smarter, not harder.
          </h2>
          <p className="text-[15px] text-text-secondary leading-relaxed mb-10">
            Track crops, log expenses, monitor income, and get ML-powered recommendations — all in one unified, intelligent platform.
          </p>
          
          <div className="flex flex-col gap-4">
            {[
              'Track complete crop cycles from planting to harvest',
              'Log and categorize expenses and income in NPR',
              'Get accurate machine-learning crop recommendations',
              'Generate visual financial reports and insights'
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-accent-light text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[14px] text-text-secondary leading-normal">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-accent text-white p-1.5 rounded-lg shadow-sm">
              <Sprout size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-text-primary">CropSys</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Welcome back</h1>
            <p className="text-sm text-text-muted">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger-light border border-danger-light text-danger-text text-sm mb-6 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-accent hover:text-accent-hover transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

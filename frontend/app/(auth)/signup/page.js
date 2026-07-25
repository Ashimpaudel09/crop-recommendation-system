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

const signupSchema = z.object({
  firstname: z.string().min(3, 'First name must be at least 3 characters'),
  lastname: z.string().min(3, 'Last name must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must include uppercase, lowercase, number, and special character')
});

export default function SignupPage() {
  const { signup } = useAuth();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data) => {
    try {
      setError('');
      await signup(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-light/50 blur-3xl -z-10" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-warning-light/50 blur-3xl -z-10" />

        <div className="w-full max-w-[440px] bg-surface-card p-8 sm:p-10 rounded-2xl shadow-xl border border-border">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="bg-accent text-white p-2 rounded-xl shadow-sm">
              <Sprout size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">CropSys</span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Create an account</h1>
            <p className="text-sm text-text-muted">Start managing your farm data efficiently</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger-light border border-danger-light text-danger-text text-sm mb-6 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex gap-4">
              <Input
                label="First name"
                placeholder="Ram"
                error={errors.firstname?.message}
                {...register('firstname')}
              />
              <Input
                label="Last name"
                placeholder="Sharma"
                error={errors.lastname?.message}
                {...register('lastname')}
              />
            </div>

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
            <p className="text-xs text-text-muted mt-[-10px]">
              Must contain 8+ characters, uppercase, lowercase, number, and symbol.
            </p>

            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-4">
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-accent hover:text-accent-hover transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

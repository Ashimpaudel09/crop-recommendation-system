import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Sprout, LineChart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-accent-light selection:text-accent-text">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden flex flex-col items-center text-center px-6">
          {/* Decorative gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-light/40 blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-warning-light/30 blur-3xl -z-10" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-border text-xs font-semibold text-text-secondary uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Smart Farming Assistant
          </div>

          <h1 className="max-w-[900px] text-5xl md:text-7xl font-bold text-text-primary tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            Optimize your harvest.<br className="hidden md:block"/>
            <span className="text-accent">Maximize your profit.</span>
          </h1>

          <p className="max-w-[600px] text-lg md:text-xl text-text-secondary leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            CropSys combines machine learning recommendations with powerful financial tracking to help modern farmers make data-driven decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Link href="/recommend">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-[var(--shadow-md)]">
                Try Crop Recommendation
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-white border-border-strong group">
                Create Free Account <ArrowRight size={18} className="text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-surface-card border-y border-border px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Everything you need to succeed</h2>
              <p className="text-lg text-text-secondary max-w-[600px] mx-auto">A unified platform bridging the gap between agricultural science and farm business management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-surface p-8 rounded-2xl border border-border hover:border-accent transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sprout size={28} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">ML Crop Prediction</h3>
                <p className="text-text-secondary leading-relaxed">
                  Input your soil nutrients, pH, temperature, and rainfall to receive scientifically backed crop recommendations using Logistic Regression and Random Forest models.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface p-8 rounded-2xl border border-border hover:border-danger-light transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-danger-light text-danger flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <LineChart size={28} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Expense Tracking</h3>
                <p className="text-text-secondary leading-relaxed">
                  Log seeds, fertilizer, labor, and machinery costs. Link expenses to specific crop cycles to understand the true cost of your harvest.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface p-8 rounded-2xl border border-border hover:border-success-light transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-success-light text-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Financial Reports</h3>
                <p className="text-text-secondary leading-relaxed">
                  Automatically generate visual reports. See exactly where your money goes and calculate net profits across different revenue streams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Trust */}
        <section className="py-24 px-6 bg-surface">
          <div className="max-w-[1000px] mx-auto bg-accent text-text-inverse rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to transform your farm?</h2>
              <p className="text-accent-light text-lg mb-10 max-w-[600px] mx-auto">
                Join modern farmers who are making data-driven decisions to increase yield and maximize profit.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-accent hover:bg-surface-raised border-white h-14 px-8 text-base">
                    Create Free Account
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-accent-light mt-4 sm:mt-0">
                  <CheckCircle2 size={16} /> No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-surface-card border-t border-border py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sprout size={20} className="text-text-muted" />
          <span className="font-bold text-text-secondary">CropSys</span>
        </div>
        <p className="text-sm text-text-muted">
          B.Sc. CSIT Final Year Project &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

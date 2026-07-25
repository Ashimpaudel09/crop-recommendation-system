"use client";

import React from 'react';
import Link from 'next/link';
import { Sprout, Receipt, DollarSign, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency, formatDate } from '@/lib/constants';
import { Card } from '@/components/ui/components';

export default function DashboardHome() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner spinner-lg text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-danger">
        <p>{error}</p>
      </div>
    );
  }

  const { totalCrops, totalExpenses, totalIncome, netProfit, recentExpenses, recentIncomes } = stats;

  const statCards = [
    {
      label: 'Active Crops',
      value: totalCrops,
      icon: Sprout,
      color: 'text-accent',
      bg: 'bg-accent-light',
      format: (v) => v,
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: Receipt,
      color: 'text-danger',
      bg: 'bg-danger-light',
      format: formatCurrency,
    },
    {
      label: 'Total Income',
      value: totalIncome,
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success-light',
      format: formatCurrency,
    },
    {
      label: 'Net Profit',
      value: netProfit,
      icon: TrendingUp,
      color: netProfit >= 0 ? 'text-success' : 'text-danger',
      bg: netProfit >= 0 ? 'bg-success-light' : 'bg-danger-light',
      format: (v) => `${v > 0 ? '+' : ''}${formatCurrency(v)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Overview</h1>
        <p className="text-sm text-text-secondary">Here's what's happening on your farm today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-5 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} strokeWidth={2} />
            </div>
            <div>
              <div className="text-[13px] font-medium text-text-secondary mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-text-primary tracking-tight">
                {stat.format(stat.value)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <Card className="p-6 lg:col-span-1 h-fit">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Activity size={18} className="text-accent" /> Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/crops" className="group flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:border-accent hover:bg-accent-light/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-surface-card p-1.5 rounded-md border border-border shadow-sm group-hover:text-accent transition-colors">
                  <Sprout size={16} />
                </div>
                <span className="text-sm font-medium text-text-primary">Add New Crop</span>
              </div>
              <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link href="/dashboard/expenses" className="group flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:border-danger-light hover:bg-danger-light/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-surface-card p-1.5 rounded-md border border-border shadow-sm group-hover:text-danger transition-colors">
                  <Receipt size={16} />
                </div>
                <span className="text-sm font-medium text-text-primary">Log Expense</span>
              </div>
              <ArrowRight size={16} className="text-text-muted group-hover:text-danger transition-transform group-hover:translate-x-1" />
            </Link>

            <Link href="/dashboard/income" className="group flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:border-success-light hover:bg-success-light/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-surface-card p-1.5 rounded-md border border-border shadow-sm group-hover:text-success transition-colors">
                  <DollarSign size={16} />
                </div>
                <span className="text-sm font-medium text-text-primary">Log Income</span>
              </div>
              <ArrowRight size={16} className="text-text-muted group-hover:text-success transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-[15px] font-semibold text-text-primary mb-4 flex items-center justify-between">
            <span>Recent Transactions</span>
            <Link href="/dashboard/reports" className="text-xs font-medium text-accent hover:underline">
              View All Reports
            </Link>
          </h3>
          
          <div className="space-y-4">
            {recentExpenses.length === 0 && recentIncomes.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm border border-dashed border-border rounded-lg">
                No recent transactions found. Start logging expenses or income!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Mix and sort recent transactions by date */}
                {[
                  ...recentExpenses.map(e => ({ ...e, type: 'expense', date: new Date(e.expenseDate) })),
                  ...recentIncomes.map(i => ({ ...i, type: 'income', date: new Date(i.incomeDate) }))
                ]
                .sort((a, b) => b.date - a.date)
                .slice(0, 6)
                .map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'expense' ? 'bg-danger-light text-danger' : 'bg-success-light text-success'
                      }`}>
                        {item.type === 'expense' ? <Receipt size={18} /> : <DollarSign size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary capitalize">
                          {item.category || item.source}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(item.date)} {item.description && `• ${item.description}`}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium ${item.type === 'expense' ? 'text-text-primary' : 'text-success'}`}>
                      {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}

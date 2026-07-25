"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Receipt, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, EXPENSE_CATEGORIES, INCOME_SOURCES } from '@/lib/constants';
import { Card } from '@/components/ui/components';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenseStats, setExpenseStats] = useState({ monthly: [], byCategory: [] });
  const [incomeStats, setIncomeStats] = useState({ monthly: [], bySource: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [expRes, incRes] = await Promise.all([
          api.get('/expense/stats'),
          api.get('/income/stats')
        ]);
        setExpenseStats(expRes.data);
        setIncomeStats(incRes.data);
      } catch (err) {
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="spinner spinner-lg text-accent" /></div>;
  }

  if (error) {
    return <div className="text-center py-20 text-danger">{error}</div>;
  }

  // Calculate totals
  const totalExpense = expenseStats.monthly.reduce((sum, m) => sum + m.total, 0);
  const totalIncome = incomeStats.monthly.reduce((sum, m) => sum + m.total, 0);
  const netProfit = totalIncome - totalExpense;

  // Formatting helpers
  const getMonthName = (monthNum) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  const getLabel = (value, type) => {
    if (type === 'expense') {
      return EXPENSE_CATEGORIES.find(c => c.value === value)?.label || value;
    }
    return INCOME_SOURCES.find(s => s.value === value)?.label || value;
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Financial Reports</h1>
        <p className="text-sm text-text-secondary">Comprehensive breakdown of your farm's financial health.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center mb-3">
            <DollarSign size={24} />
          </div>
          <p className="text-sm font-medium text-text-secondary mb-1">Total Revenue</p>
          <h2 className="text-2xl font-bold text-text-primary">{formatCurrency(totalIncome)}</h2>
        </Card>
        
        <Card className="p-5 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-danger-light text-danger flex items-center justify-center mb-3">
            <Receipt size={24} />
          </div>
          <p className="text-sm font-medium text-text-secondary mb-1">Total Costs</p>
          <h2 className="text-2xl font-bold text-text-primary">{formatCurrency(totalExpense)}</h2>
        </Card>

        <Card className={`p-5 flex flex-col items-center justify-center text-center border-2 ${netProfit >= 0 ? 'border-success-light' : 'border-danger-light'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${netProfit >= 0 ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
            {netProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <p className="text-sm font-medium text-text-secondary mb-1">Net Profit / Loss</p>
          <h2 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
            {netProfit > 0 ? '+' : ''}{formatCurrency(netProfit)}
          </h2>
        </Card>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        
        {/* Expense Breakdown */}
        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-text-primary mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-danger" /> Cost Breakdown by Category
          </h3>
          
          {expenseStats.byCategory.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm border border-dashed border-border rounded-lg">
              No expense data available.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {expenseStats.byCategory.map((cat, i) => {
                const percentage = ((cat.total / totalExpense) * 100).toFixed(1);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-text-primary">{getLabel(cat._id, 'expense')}</span>
                      <span className="text-text-muted">{formatCurrency(cat.total)} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-danger rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Income Breakdown */}
        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-text-primary mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-success" /> Revenue Breakdown by Source
          </h3>
          
          {incomeStats.bySource.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm border border-dashed border-border rounded-lg">
              No income data available.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {incomeStats.bySource.map((src, i) => {
                const percentage = ((src.total / totalIncome) * 100).toFixed(1);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-text-primary">{getLabel(src._id, 'income')}</span>
                      <span className="text-text-muted">{formatCurrency(src.total)} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

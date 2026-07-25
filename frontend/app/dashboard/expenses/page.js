"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Receipt, Plus, Search, Trash2, Sprout } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { useCrops } from '@/hooks/useCrops';
import { formatDate, formatCurrency, EXPENSE_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, EmptyState, Badge } from '@/components/ui/components';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  category: z.string().nonempty('Category is required'),
  expenseDate: z.string().nonempty('Date is required'),
  description: z.string().max(500, 'Description too long').optional(),
  cropId: z.string().optional().or(z.literal('')),
});

export default function ExpensesPage() {
  const { expenses, loading: expensesLoading, addExpense, deleteExpense } = useExpenses();
  const { crops, loading: cropsLoading } = useCrops();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: { expenseDate: new Date().toISOString().split('T')[0] }
  });

  const onSubmit = async (data) => {
    try {
      await addExpense(data);
      setShowAddForm(false);
      reset();
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  let filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.category.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
      (e.cropId?.cropName && e.cropId.cropName.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  filteredExpenses.sort((a, b) => {
    if (sortOrder === 'amount-asc') return a.amount - b.amount;
    if (sortOrder === 'amount-desc') return b.amount - a.amount;
    if (sortOrder === 'oldest') return new Date(a.expenseDate) - new Date(b.expenseDate);
    return new Date(b.expenseDate) - new Date(a.expenseDate);
  });

  const getCategoryBadge = (category) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.value === category);
    return <Badge variant="default" className="border border-border bg-surface">{cat ? cat.label : category}</Badge>;
  };

  if (expensesLoading || cropsLoading) {
    return <div className="flex justify-center py-20"><div className="spinner spinner-lg text-accent" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Expenses</h1>
          <p className="text-sm text-text-secondary">Track and manage your farming costs.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} />
          {showAddForm ? 'Cancel' : 'Log Expense'}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6 bg-surface-raised/50 border-accent/20 border">
          <h3 className="text-sm font-semibold mb-4 text-text-primary">Log New Expense</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            <Input
              label="Amount (NPR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.amount?.message}
              {...register('amount')}
            />
            <Select
              label="Category"
              options={EXPENSE_CATEGORIES}
              error={errors.category?.message}
              {...register('category')}
            />
            <Input
              label="Date"
              type="date"
              error={errors.expenseDate?.message}
              {...register('expenseDate')}
            />
            <Select
              label="Associated Crop (Optional)"
              options={crops.map(c => ({ value: c._id, label: c.cropName }))}
              error={errors.cropId?.message}
              {...register('cropId')}
            />
            <div className="lg:col-span-2">
              <Input
                label="Description"
                placeholder="Details about this expense..."
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
            <div className="lg:col-span-3 flex justify-end mt-2">
              <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
                Save Expense
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Toolbar */}
      {!showAddForm && expenses.length > 0 && (
        <div className="flex items-center gap-4 bg-surface-card p-2 rounded-lg border border-border shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-text-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 pr-2 border-l border-border pl-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-text-secondary cursor-pointer hover:text-text-primary hidden sm:block"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            
            <div className="hidden sm:block w-px h-4 bg-border mx-2"></div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-text-secondary cursor-pointer hover:text-text-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-desc">High to Low</option>
              <option value="amount-asc">Low to High</option>
            </select>
          </div>
        </div>
      )}

      {/* Expense List */}
      {expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses logged"
          description="Start tracking your costs to generate financial insights."
          action={<Button onClick={() => setShowAddForm(true)}>Log First Expense</Button>}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Crop</th>
                <th className="text-right">Amount</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="whitespace-nowrap font-medium text-text-primary">{formatDate(expense.expenseDate)}</td>
                  <td>{getCategoryBadge(expense.category)}</td>
                  <td className="max-w-xs truncate" title={expense.description}>{expense.description || '—'}</td>
                  <td>
                    {expense.cropId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-accent-light text-accent-text px-2 py-0.5 rounded-md">
                        <Sprout size={12} /> {expense.cropId.cropName}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="text-right font-semibold text-danger">{formatCurrency(expense.amount)}</td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleDelete(expense._id)}
                      className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-light rounded-md transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
